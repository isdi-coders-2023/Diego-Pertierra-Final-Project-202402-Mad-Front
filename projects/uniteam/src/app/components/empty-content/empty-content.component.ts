import { Component, Input, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'isdi-empty-content',
  standalone: true,
  template: `
    <article>
      <img
        src="assets/img/icons/sad.svg"
        alt="Icono de cara triste"
        width="80"
      />
      <p>Vaya, parece que aún no {{ label }}</p>
      <isdi-button [label]="'Buscar quedadas'" [routerLink]="['/meets']" />
    </article>
  `,
  styleUrl: './empty-content.component.css',
  imports: [ButtonComponent, RouterModule],
})
export class EmptyContentComponent {
  state = inject(StateService);
  @Input() label!: string;
}
