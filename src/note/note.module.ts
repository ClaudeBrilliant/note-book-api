import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { DatabaseModule } from 'src/database/database.module';
import { NoteController } from './note.controller';

@Module({
  imports: [DatabaseModule], // <-- important
  providers: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
