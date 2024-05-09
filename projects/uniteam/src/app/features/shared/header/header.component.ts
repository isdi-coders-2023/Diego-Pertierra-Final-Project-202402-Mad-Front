import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { MenuOption } from '../../../core/models/menu-option';
import { StateService } from '../../../core/services/state.service';

@Component({
  selector: 'isdi-header',
  standalone: true,
  imports: [MenuComponent],
  template: `<isdi-menu [items]="menuOptions" />`,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOptions: MenuOption[] = [];

  constructor(private stateSrv: StateService) {
    this.menuOptions = this.stateSrv.setRoutes();
  }
}
