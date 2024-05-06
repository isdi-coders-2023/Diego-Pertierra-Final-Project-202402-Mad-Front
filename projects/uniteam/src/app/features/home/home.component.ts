import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { StateService, UserState } from '../../core/services/state.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'isdi-home',
  standalone: true,
  imports: [HeaderComponent, JsonPipe],
  template: `
    <isdi-header />
    <h2>Home</h2>

    @switch (state.loginState) { @case ('idle') {
    <p>Esperando al usuario</p>
    } @case ('logged') {
    <p>Welcome</p>
    <pre>{{ state.currentUser | json }}</pre>
    <button (click)="logout()">Log out</button>
    } @case ('error') {
    <p>Error de acceso</p>
    } }
  `,
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  stateService = inject(StateService);
  state!: UserState;

  ngOnInit(): void {
    this.stateService.getUserState().subscribe((state) => {
      this.state = state;
    });
  }

  logout() {
    this.stateService.setLogout();
  }
}
