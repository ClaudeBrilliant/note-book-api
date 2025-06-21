/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Note } from './interfaces/notes.interface';
import { DatabaseService } from 'src/database/connection.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';

@Injectable()
export class NoteService {
  [x: string]: any;
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateNoteDto): Promise<Note> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_create_note($1, $2, $3)',
        [data.title, data.content, data.createdAt],
      );

      if (!result.rows[0]) {
        throw new InternalServerErrorException('Failed to create note');
      }

      return this.mapRowToNote(result.rows[0]);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('Note already exists');
      }
      console.error('Create note error:', error);
      throw new InternalServerErrorException('Failed to create note');
    }
  }

  async findAll(): Promise<Note[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_notes()',
      );
      return result.rows.map((row: any) => this.mapRowToNote(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve notes');
    }
  }

  async findOne(id: number): Promise<Note> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return this.mapRowToNote(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve note');
    }
  }

  async update(id: number, data: UpdateNoteDto): Promise<Note> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_update_by_id($1, $2, $3, $4)',
        [id, data.title || null, data.content || null, data.createdAt || null],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return this.mapRowToNote(result.rows[0]);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('already exists')) {
          throw new ConflictException(error.message);
        }
      }

      throw new InternalServerErrorException('Failed to update note');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_soft_delete_note($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to soft delete note');
    }
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_delete_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to delete note');
    }
  }

  private mapRowToNote(row: any): Note {
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      createdAt: row.createdAt,
    };
  }
}
