-- Tabel untuk sesi voting pemimpin aliansi
CREATE TABLE alliance_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk mencatat suara dalam voting
CREATE TABLE alliance_vote_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voting_session_id UUID REFERENCES alliance_votes(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL,
    candidate_id UUID NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(voting_session_id, voter_id)
);

-- Tabel untuk perang aliansi
CREATE TABLE alliance_wars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attacker_alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    defender_alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
    war_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (attacker_alliance_id != defender_alliance_id)
);

-- Tabel untuk mencatat partisipan perang aliansi
CREATE TABLE alliance_war_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    war_id UUID REFERENCES alliance_wars(id) ON DELETE CASCADE,
    alliance_id UUID REFERENCES alliances(id) ON DELETE CASCADE,
    side TEXT NOT NULL CHECK (side IN ('attacker', 'defender')),
    contribution_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fungsi untuk memulai voting pemimpin baru
CREATE OR REPLACE FUNCTION start_alliance_voting(alliance_id UUID)
RETURNS UUID AS $$
DECLARE
    voting_id UUID;
BEGIN
    -- Cek apakah sudah ada voting aktif
    IF EXISTS (
        SELECT 1 FROM alliance_votes 
        WHERE alliance_id = alliance_id 
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Sudah ada sesi voting aktif';
    END IF;

    -- Buat sesi voting baru
    INSERT INTO alliance_votes (
        alliance_id,
        start_time,
        end_time,
        status
    ) VALUES (
        alliance_id,
        NOW(),
        NOW() + INTERVAL '24 hours',
        'active'
    ) RETURNING id INTO voting_id;

    RETURN voting_id;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk menghitung hasil voting
CREATE OR REPLACE FUNCTION calculate_voting_results(voting_id UUID)
RETURNS TABLE (
    candidate_id UUID,
    vote_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        candidate_id,
        COUNT(*) as vote_count
    FROM alliance_vote_records
    WHERE voting_session_id = voting_id
    GROUP BY candidate_id
    ORDER BY vote_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk mendeklarasikan perang aliansi
CREATE OR REPLACE FUNCTION declare_alliance_war(
    attacker_alliance_id UUID,
    defender_alliance_id UUID
) RETURNS UUID AS $$
DECLARE
    war_id UUID;
BEGIN
    -- Cek apakah aliansi penyerang sudah dalam perang
    IF EXISTS (
        SELECT 1 FROM alliance_wars
        WHERE (attacker_alliance_id = attacker_alliance_id OR defender_alliance_id = attacker_alliance_id)
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Aliansi penyerang sudah dalam perang';
    END IF;

    -- Cek apakah aliansi bertahan sudah dalam perang
    IF EXISTS (
        SELECT 1 FROM alliance_wars
        WHERE (attacker_alliance_id = defender_alliance_id OR defender_alliance_id = defender_alliance_id)
        AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Aliansi bertahan sudah dalam perang';
    END IF;

    -- Buat perang baru
    INSERT INTO alliance_wars (
        attacker_alliance_id,
        defender_alliance_id,
        start_time,
        end_time,
        status
    ) VALUES (
        attacker_alliance_id,
        defender_alliance_id,
        NOW(),
        NOW() + INTERVAL '7 days',
        'active'
    ) RETURNING id INTO war_id;

    -- Tambahkan partisipan perang
    INSERT INTO alliance_war_participants (war_id, alliance_id, side)
    VALUES 
        (war_id, attacker_alliance_id, 'attacker'),
        (war_id, defender_alliance_id, 'defender');

    RETURN war_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk memperbarui status voting
CREATE OR REPLACE FUNCTION update_voting_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status voting yang sudah berakhir
    UPDATE alliance_votes
    SET status = 'completed'
    WHERE end_time < NOW()
    AND status = 'active';

    -- Update pemimpin aliansi jika voting selesai
    IF NEW.status = 'completed' THEN
        WITH voting_results AS (
            SELECT candidate_id, COUNT(*) as vote_count
            FROM alliance_vote_records
            WHERE voting_session_id = NEW.id
            GROUP BY candidate_id
            ORDER BY vote_count DESC
            LIMIT 1
        )
        UPDATE alliance_members
        SET rank_type = 'leader'
        WHERE alliance_id = NEW.alliance_id
        AND player_id = (SELECT candidate_id FROM voting_results);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voting_status_trigger
AFTER UPDATE ON alliance_votes
FOR EACH ROW
EXECUTE FUNCTION update_voting_status();

-- Trigger untuk memperbarui status perang
CREATE OR REPLACE FUNCTION update_war_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update status perang yang sudah berakhir
    UPDATE alliance_wars
    SET status = 'completed'
    WHERE end_time < NOW()
    AND status = 'active';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_war_status_trigger
AFTER UPDATE ON alliance_wars
FOR EACH ROW
EXECUTE FUNCTION update_war_status();

-- Enable RLS
ALTER TABLE alliance_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_vote_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_wars ENABLE ROW LEVEL SECURITY;
ALTER TABLE alliance_war_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Alliance members can view votes"
ON alliance_votes FOR SELECT
USING (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id = alliance_votes.alliance_id
    AND player_id = auth.uid()
));

CREATE POLICY "Alliance members can vote"
ON alliance_vote_records FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id = (
        SELECT alliance_id FROM alliance_votes
        WHERE id = voting_session_id
    )
    AND player_id = auth.uid()
));

CREATE POLICY "Alliance leaders can declare war"
ON alliance_wars FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id = attacker_alliance_id
    AND player_id = auth.uid()
    AND rank_type = 'leader'
));

CREATE POLICY "Alliance members can view wars"
ON alliance_wars FOR SELECT
USING (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id IN (attacker_alliance_id, defender_alliance_id)
    AND player_id = auth.uid()
));

-- Indexes
CREATE INDEX idx_alliance_votes_alliance_id ON alliance_votes(alliance_id);
CREATE INDEX idx_alliance_vote_records_voting_session_id ON alliance_vote_records(voting_session_id);
CREATE INDEX idx_alliance_wars_alliances ON alliance_wars(attacker_alliance_id, defender_alliance_id);
CREATE INDEX idx_alliance_war_participants_war_id ON alliance_war_participants(war_id); 