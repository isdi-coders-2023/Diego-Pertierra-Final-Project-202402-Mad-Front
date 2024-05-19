import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'isdi-info-modal',
  standalone: true,
  imports: [],
  template: `
    <div class="modal" [style.display]="isModalOpen ? 'flex' : 'none'">
      <div class="modal-content">
        <h2>{{ content }}</h2>
        <button class="modal-close" (click)="closeModal()">✖</button>
      </div>
    </div>
  `,
  styleUrl: './info-modal.component.css',
})
export class InfoModalComponent {
  @Input() content!: string;
  @Input() isModalOpen: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  closeModal(): void {
    this.closeModalEvent.emit();
  }
}
