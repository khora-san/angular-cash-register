import { Component, inject, output, signal } from '@angular/core';
import { Note, NoteLine } from '../../services/note';
import { EurosPipe } from '../../shared/euros-pipe';
import { Orders } from '../../services/orders';
import { Order } from '../../models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [EurosPipe],
  selector: 'app-note-panel',
  styleUrl: './note-panel.css',
  templateUrl: './note-panel.html',
})
export class NotePanel {
  protected readonly noteService = inject(Note);
  private readonly ordersService = inject(Orders);
  private clearMessageTimer?: ReturnType<typeof setTimeout>;

  orderSubmitted = output<void>();

  paying = signal(false);
  lastPayment = signal<Order | null>(null);
  paymentError = signal<string | null>(null);

  /**
   * Unique tracking key for @for: product lines have no line-level id, so we
   * derive one from the product id; formula lines already carry a real id.
   */
  lineKey(line: NoteLine): string {
    return line.kind === 'product' ? `product-${line.product.id}` : line.id;
  }

  /**
   * Pays the note. Emits `orderSubmitted` on both success and error, since a
   * 409 (insufficient stock) means the catalog's stock has already moved.
   */
  pay() {
    this.paying.set(true);
    this.paymentError.set(null);
    this.ordersService.pay(this.noteService.toOrderRequest()).subscribe({
      next: (order) => {
        this.paying.set(false);
        this.lastPayment.set(order);
        this.noteService.clear();
        this.orderSubmitted.emit();
        clearTimeout(this.clearMessageTimer);
        this.clearMessageTimer = setTimeout(() => this.lastPayment.set(null), 4000);
      },
      error: (err: HttpErrorResponse) => {
        this.paying.set(false);
        this.paymentError.set(err.error?.message ?? 'Erreur lors du paiement');
        this.orderSubmitted.emit();
      },
    });
  }
}
