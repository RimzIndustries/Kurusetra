-- Tambahkan kolom kuota ke tabel alliances
ALTER TABLE alliances
ADD COLUMN max_members INTEGER DEFAULT 15,
ADD COLUMN current_members INTEGER DEFAULT 0;

-- Fungsi untuk mengecek dan memperbarui jumlah anggota
CREATE OR REPLACE FUNCTION check_alliance_member_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current_members saat ada perubahan anggota
    IF TG_OP = 'INSERT' THEN
        UPDATE alliances
        SET current_members = current_members + 1
        WHERE id = NEW.alliance_id;
        
        -- Cek apakah melebihi kuota
        IF EXISTS (
            SELECT 1 FROM alliances
            WHERE id = NEW.alliance_id
            AND current_members > max_members
        ) THEN
            RAISE EXCEPTION 'Aliansi sudah mencapai batas maksimal anggota';
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE alliances
        SET current_members = current_members - 1
        WHERE id = OLD.alliance_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk memantau perubahan anggota
CREATE TRIGGER alliance_member_count_trigger
AFTER INSERT OR DELETE ON alliance_members
FOR EACH ROW
EXECUTE FUNCTION check_alliance_member_count();

-- Fungsi untuk memulai voting pemimpin baru dengan validasi
CREATE OR REPLACE FUNCTION start_alliance_voting(alliance_id UUID)
RETURNS UUID AS $$
DECLARE
    voting_id UUID;
    member_count INTEGER;
BEGIN
    -- Cek jumlah anggota minimal untuk voting
    SELECT current_members INTO member_count
    FROM alliances
    WHERE id = alliance_id;
    
    IF member_count < 3 THEN
        RAISE EXCEPTION 'Minimal 3 anggota diperlukan untuk memulai voting';
    END IF;

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

-- Fungsi untuk mendeklarasikan perang dengan validasi tambahan
CREATE OR REPLACE FUNCTION declare_alliance_war(
    attacker_alliance_id UUID,
    defender_alliance_id UUID
) RETURNS UUID AS $$
DECLARE
    war_id UUID;
    attacker_members INTEGER;
    defender_members INTEGER;
BEGIN
    -- Cek jumlah anggota minimal untuk perang
    SELECT current_members INTO attacker_members
    FROM alliances
    WHERE id = attacker_alliance_id;
    
    SELECT current_members INTO defender_members
    FROM alliances
    WHERE id = defender_alliance_id;
    
    IF attacker_members < 5 OR defender_members < 5 THEN
        RAISE EXCEPTION 'Minimal 5 anggota diperlukan untuk memulai perang';
    END IF;

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

-- Update RLS policies
CREATE POLICY "Alliance members can view alliance details"
ON alliances FOR SELECT
USING (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id = alliances.id
    AND player_id = auth.uid()
));

CREATE POLICY "Alliance leaders can update alliance"
ON alliances FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM alliance_members
    WHERE alliance_id = alliances.id
    AND player_id = auth.uid()
    AND rank_type = 'leader'
));

-- Indexes untuk optimasi query
CREATE INDEX idx_alliances_current_members ON alliances(current_members);
CREATE INDEX idx_alliance_members_alliance_id ON alliance_members(alliance_id);
CREATE INDEX idx_alliance_wars_status ON alliance_wars(status);
CREATE INDEX idx_alliance_votes_status ON alliance_votes(status); 