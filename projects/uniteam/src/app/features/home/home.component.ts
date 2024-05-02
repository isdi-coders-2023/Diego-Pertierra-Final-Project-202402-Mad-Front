import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'isdi-home',
  standalone: true,
  imports: [HeaderComponent],
  template: ` <isdi-header /> `,
  styleUrl: './home.component.css',
})
export default class HomeComponent {}
