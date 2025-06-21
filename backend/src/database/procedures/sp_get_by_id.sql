CREATE OR REPLACE FUNCTION sp_get_by_id(
    p_id INTEGER
)
RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    content VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
