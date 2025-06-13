#!/bin/bash

# echo " Setting up Hotel Management DB....."

# # Create database
# psql -U postgres -h localhost -c "CREATE DATABASE note_books;"

# # Run migrations 
# psql -U postgres -h localhost -d note_books -f src/database/migrations/001_initial_schema.sql

# # CREATE stored procedures
psql -U postgres -h localhost -d note_books -f src/database/procedures/sp_create_note.sql
# psql -U postgres -h localhost -d note_books -f src/database/procedures/sp_get_notes.sql
# psql -U postgres -h localhost -d note_books -f src/database/procedures/sp_update_by_id.sql
# psql -U postgres -h localhost -d note_books -f src/database/procedures/sp_delete_by_id.sql
# psql -U postgres -h localhost -d note_books -f src/database/procedures/sp_get_by_id.sql




echo "DATABASE setup complete..."

echo " You can now run : npm run start:dev"