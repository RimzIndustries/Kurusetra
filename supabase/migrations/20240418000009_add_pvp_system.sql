-- Tabel untuk menyimpan statistik PvP pemain
CREATE TABLE player_pvp_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    power_level INTEGER NOT NULL DEFAULT 1000,
    win_count INTEGER DEFAULT 0,
    loss_count INTEGER DEFAULT 0,
    draw_count INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    highest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(player_id)
);

-- Tabel untuk menyimpan pertandingan PvP
CREATE TABLE pvp_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenger_id UUID REFERENCES players(id) ON DELETE CASCADE,
    defender_id UUID REFERENCES players(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    match_type TEXT NOT NULL CHECK (match_type IN ('friendly', 'ranked')),
    power_difference INTEGER NOT NULL,
    winner_id UUID REFERENCES players(id),
    match_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK (challenger_id != defender_id)
);

-- Fungsi untuk menghitung power difference
CREATE OR REPLACE FUNCTION calculate_power_difference(
    challenger_power INTEGER,
    defender_power INTEGER
) RETURNS INTEGER AS $$
BEGIN
    RETURN ABS(challenger_power - defender_power);
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk mengecek kesesuaian matchmaking
CREATE OR REPLACE FUNCTION check_matchmaking_eligibility(
    challenger_id UUID,
    defender_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    challenger_power INTEGER;
    defender_power INTEGER;
    power_diff INTEGER;
BEGIN
    -- Ambil power level kedua pemain
    SELECT power_level INTO challenger_power
    FROM player_pvp_stats
    WHERE player_id = challenger_id;

    SELECT power_level INTO defender_power
    FROM player_pvp_stats
    WHERE player_id = defender_id;

    -- Hitung perbedaan power
    power_diff := calculate_power_difference(challenger_power, defender_power);

    -- Return true jika perbedaan power dalam range yang diizinkan
    RETURN power_diff <= 200;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk membuat challenge PvP
CREATE OR REPLACE FUNCTION create_pvp_challenge(
    challenger_id UUID,
    defender_id UUID,
    match_type TEXT
) RETURNS UUID AS $$
DECLARE
    match_id UUID;
    power_diff INTEGER;
BEGIN
    -- Cek kesesuaian matchmaking
    IF NOT check_matchmaking_eligibility(challenger_id, defender_id) THEN
        RAISE EXCEPTION 'Perbedaan power level terlalu besar';
    END IF;

    -- Hitung power difference
    SELECT calculate_power_difference(
        (SELECT power_level FROM player_pvp_stats WHERE player_id = challenger_id),
        (SELECT power_level FROM player_pvp_stats WHERE player_id = defender_id)
    ) INTO power_diff;

    -- Buat match baru
    INSERT INTO pvp_matches (
        challenger_id,
        defender_id,
        status,
        match_type,
        power_difference
    ) VALUES (
        challenger_id,
        defender_id,
        'pending',
        match_type,
        power_diff
    ) RETURNING id INTO match_id;

    RETURN match_id;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk memproses hasil pertandingan
CREATE OR REPLACE FUNCTION process_pvp_result(
    match_id UUID,
    winner_id UUID
) RETURNS VOID AS $$
DECLARE
    match_record RECORD;
    power_change INTEGER;
BEGIN
    -- Ambil data match
    SELECT * INTO match_record
    FROM pvp_matches
    WHERE id = match_id;

    -- Hitung perubahan power berdasarkan power difference
    power_change := LEAST(50, GREATEST(10, match_record.power_difference / 4));

    -- Update statistik pemain
    IF winner_id = match_record.challenger_id THEN
        -- Update challenger stats
        UPDATE player_pvp_stats
        SET 
            power_level = power_level + power_change,
            win_count = win_count + 1,
            current_streak = current_streak + 1,
            highest_streak = GREATEST(highest_streak, current_streak + 1)
        WHERE player_id = match_record.challenger_id;

        -- Update defender stats
        UPDATE player_pvp_stats
        SET 
            power_level = GREATEST(100, power_level - power_change),
            loss_count = loss_count + 1,
            current_streak = 0
        WHERE player_id = match_record.defender_id;
    ELSE
        -- Update defender stats
        UPDATE player_pvp_stats
        SET 
            power_level = power_level + power_change,
            win_count = win_count + 1,
            current_streak = current_streak + 1,
            highest_streak = GREATEST(highest_streak, current_streak + 1)
        WHERE player_id = match_record.defender_id;

        -- Update challenger stats
        UPDATE player_pvp_stats
        SET 
            power_level = GREATEST(100, power_level - power_change),
            loss_count = loss_count + 1,
            current_streak = 0
        WHERE player_id = match_record.challenger_id;
    END IF;

    -- Update match status
    UPDATE pvp_matches
    SET 
        status = 'completed',
        winner_id = winner_id,
        updated_at = NOW()
    WHERE id = match_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk memperbarui statistik PvP saat pemain baru dibuat
CREATE OR REPLACE FUNCTION initialize_pvp_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO player_pvp_stats (player_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER initialize_pvp_stats_trigger
AFTER INSERT ON players
FOR EACH ROW
EXECUTE FUNCTION initialize_pvp_stats();

-- Enable RLS
ALTER TABLE player_pvp_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE pvp_matches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Players can view their own PvP stats"
ON player_pvp_stats FOR SELECT
USING (player_id = auth.uid());

CREATE POLICY "Players can view PvP matches they are involved in"
ON pvp_matches FOR SELECT
USING (challenger_id = auth.uid() OR defender_id = auth.uid());

CREATE POLICY "Players can create PvP challenges"
ON pvp_matches FOR INSERT
WITH CHECK (challenger_id = auth.uid());

CREATE POLICY "Players can update their own PvP matches"
ON pvp_matches FOR UPDATE
USING (challenger_id = auth.uid() OR defender_id = auth.uid());

-- Indexes
CREATE INDEX idx_player_pvp_stats_power_level ON player_pvp_stats(power_level);
CREATE INDEX idx_pvp_matches_status ON pvp_matches(status);
CREATE INDEX idx_pvp_matches_players ON pvp_matches(challenger_id, defender_id); 