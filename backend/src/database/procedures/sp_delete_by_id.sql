CREATE OR REPLACE FUNCTION sp_delete_by_id(
    p_id INTEGER
)
RETURNS VOID AS $$
BEGIN
    DELETE FROM notes WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
