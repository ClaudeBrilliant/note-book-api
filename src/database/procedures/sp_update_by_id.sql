CREATE OR REPLACE FUNCTION sp_update_by_id(
    p_id INTEGER,
    p_title VARCHAR(255),
    p_content VARCHAR(255)
)
RETURNS TABLE(
    id INTEGER,
    title VARCHAR(255),
    content VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
) AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM notes WHERE id = p_id) THEN
        RAISE EXCEPTION 'Note with id % does not exist', p_id;
    END IF;

    UPDATE notes
    SET
        title = p_title,
        content = p_content,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN QUERY
    SELECT id, title, content, created_at, updated_at
    FROM notes
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;