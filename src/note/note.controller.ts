import { NoteService } from './note.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CreateNoteDto } from './dtos/create-note.dto';
import { UpdateNoteDto } from './dtos/update-note.dto';
import { Note } from './interfaces/notes.interface';
import { ApiResponse } from 'src/shared/interfaces/api-response/api-response';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateNoteDto): Promise<ApiResponse<Note>> {
    try {
      const note = await this.noteService.create(data);
      return {
        success: true,
        message: 'Note added successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add note [Controller]',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  async findAll(): Promise<ApiResponse<Note[]>> {
    try {
      const notes = await this.noteService.findAll();
      return {
        success: true,
        message: 'Notes retrieved successfully',
        data: notes,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve notes',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Note>> {
    try {
      const note = await this.noteService.findOne(id);
      return {
        success: true,
        message: 'Note retrieved successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve note',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateNoteDto,
  ): Promise<ApiResponse<Note>> {
    try {
      const note = await this.noteService.update(id, data);
      return {
        success: true,
        message: 'Note updated successfully',
        data: note,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update note',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  async hardDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const result = await this.noteService.delete(id);
      return {
        success: true,
        message: `Note permanently deleted: ${result.message}`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to hard delete note',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
