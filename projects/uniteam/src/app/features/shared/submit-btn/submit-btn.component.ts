import { Component, Input } from '@angular/core';

@Component({
  selector: 'isdi-submit-btn',
  standalone: true,
  imports: [],
  template: `
    <button [class.disabled-btn]="this.disabled" [disabled]="disabled">
      {{ label }}
    </button>
  `,
  styleUrl: './submit-btn.component.css',
})
export class SubmitBtnComponent {
  @Input() label: string = 'Submit';
  @Input() disabled: boolean = false;
}
