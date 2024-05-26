import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'isdi-confirmation-modal',
  standalone: true,
  template: `
    <div class="confirmation-modal">
      <div class="modal">
        <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>
        <isdi-button
          [label]="'Confirmar'"
          (click)="confirm()"
          [backgroundColor]="'rgb(200, 51, 51)'"
        />
        <isdi-button
          [label]="'Cancelar'"
          [backgroundColor]="'rgb(71, 177, 111)'"
          (click)="cancel()"
        />
      </div>
    </div>
  `,
  styleUrl: './confirmation-modal.component.css',
  imports: [ButtonComponent],
})
export class ConfirmationModalComponent {
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();

  confirm() {
    this.confirmed.emit();
  }

  cancel() {
    this.canceled.emit();
  }
}
