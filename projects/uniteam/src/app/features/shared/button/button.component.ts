import { Component, Input } from '@angular/core';

@Component({
  selector: 'isdi-button',
  standalone: true,
  imports: [],
  template: `
    <button>
      {{ label }}
    </button>
  `,
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() label!: string;
}
