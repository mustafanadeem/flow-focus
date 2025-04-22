-- Create enum for session types
CREATE TYPE session_type AS ENUM
('focus', 'break', 'long_break');

-- Create sessions table
CREATE TABLE sessions
(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type session_type NOT NULL,
    duration INTEGER NOT NULL,
    -- in minutes
    started_at TIMESTAMP
    WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP
    WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP
    WITH TIME ZONE DEFAULT NOW
    (),
    updated_at TIMESTAMP
    WITH TIME ZONE DEFAULT NOW
    ()
);

    -- Add RLS policies
    ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own sessions"
    ON sessions FOR
    SELECT
        USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own sessions"
    ON sessions FOR
    INSERT
    WITH CHECK (auth.uid() =
    user_id);

    -- Create function to get weekly focus time
    CREATE OR REPLACE FUNCTION get_weekly_focus_time
    ()
RETURNS TABLE
    (
    date DATE,
    total_duration INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
    SET search_path
    = public
AS $$
    BEGIN
        RETURN QUERY
        WITH
            dates
            AS
            (
                SELECT generate_series(
            date_trunc('week', CURRENT_DATE)
            ::date,
        (date_trunc
        ('week', CURRENT_DATE) + interval '6 days')::date,
            interval '1 day'
        )::date AS date
    )
        SELECT
            d.date,
            COALESCE(SUM(
            CASE 
                WHEN s.type = 'focus' THEN s.duration 
                ELSE 0 
            END
        ), 0)
        ::INTEGER as total_duration
    FROM dates d
    LEFT JOIN sessions s 
        ON date_trunc
        ('day', s.completed_at AT TIME ZONE 'UTC') = d.date
        AND s.user_id = auth.uid
        ()
    GROUP BY d.date
    ORDER BY d.date;
    END;
$$; 