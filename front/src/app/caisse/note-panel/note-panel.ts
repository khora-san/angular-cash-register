import { Component, inject } from '@angular/core';
import { Note, NoteLine } from '../../services/note';
import { EurosPipe } from '../../shared/euros-pipe';

@Component({
  imports: [EurosPipe],
  selector: 'app-note-panel',
  styleUrl: './note-panel.css',
  templateUrl: './note-panel.html',
})
export class NotePanel {
  protected readonly noteService = inject(Note);

  /**
   * Unique tracking key for @for: product lines have no line-level id, so we
   * derive one from the product id; formula lines already carry a real id.
   */
  lineKey(line: NoteLine): string {
    return line.kind === 'product' ? `product-${line.product.id}` : line.id;
  }
}
