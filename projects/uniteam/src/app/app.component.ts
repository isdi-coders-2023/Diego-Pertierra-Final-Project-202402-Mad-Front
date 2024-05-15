import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StateService } from './core/services/state.service';

@Component({
  selector: 'isdi-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styles: ``,
})
export class AppComponent {
  stateService = inject(StateService);

  constructor() {
    const stringToken = localStorage.getItem('TFD');
    if (stringToken) {
      const { token } = JSON.parse(stringToken);
      this.stateService.setLogin(token);
      console.log(token);
    }
  }
}
