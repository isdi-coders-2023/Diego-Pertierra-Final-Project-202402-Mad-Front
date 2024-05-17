import { Component, Input } from '@angular/core';

@Component({
  selector: 'isdi-button',
  standalone: true,
  imports: [],
  template: `
    <button [style.background-color]="backgroundColor">
      {{ label }}
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() label!: string;
  @Input() backgroundColor: string = 'rgb(71, 177, 111)';
}
