import { Component, inject } from '@angular/core';
import { Note } from '../../services/note';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [EurosPipe],
  selector: 'app-note-panel',
  styleUrl: './note-panel.css',
  templateUrl: './note-panel.html',
})
export class NotePanel {
  protected readonly noteService = inject(Note);
}
