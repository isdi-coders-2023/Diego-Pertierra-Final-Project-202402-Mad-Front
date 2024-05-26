import { Component, Input, inject } from '@angular/core';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'isdi-profile-avatar',
  standalone: true,
  imports: [],
  template: `
    @if (avatar) {
    <img
      src="{{ this.state.constructImageUrl(avatar, width, height) }}"
      alt="Imagen del usuario"
    />
    }
  `,
  styleUrl: './profile-avatar.component.css',
})
export class ProfileAvatarComponent {
  state = inject(StateService);
  @Input() width!: string;
  @Input() height!: string;
  @Input() avatar!: string;
}
