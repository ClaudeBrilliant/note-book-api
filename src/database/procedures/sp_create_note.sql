CREATE OR REPLACE FUNCTION sp_create_note(
  _title TEXT,
  _content TEXT,
  _created_at TIMESTAMP
)
RETURNS TABLE(id UUID, title TEXT, content TEXT, created_at TIMESTAMP) AS $$
BEGIN
  RETURN QUERY
  INSERT INTO notes (title, content, created_at)
VALUES (_title, _content, _created_at)
RETURNING notes.id, notes.title, notes.content, notes.created_at;

END;
$$ LANGUAGE plpgsql;
