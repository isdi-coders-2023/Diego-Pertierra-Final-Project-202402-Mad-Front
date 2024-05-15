import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { StateService, State } from '../../core/services/state.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { FooterComponent } from '../shared/footer/footer.component';
import { MeetListComponent } from '../meet-list/meet-list.component';

@Component({
  selector: 'isdi-home',
  standalone: true,
  imports: [HeaderComponent, AsyncPipe, FooterComponent, MeetListComponent],
  template: `
    <isdi-header />

    @if ( (stateService.getState() | async)!.loginState === 'logged') {
    <section>
      @if (currentUser) {
      <h2>
        Bienvenido, <strong>{{ currentUser.username }}</strong>
      </h2>
      }
      <h2>Tus quedadas</h2>

      <isdi-meet-list [meetList]="currentUser.savedMeets" />
    </section>
    }
    <isdi-footer />
  `,
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  router = inject(Router);
  stateService = inject(StateService);
  state!: State;
  currentUser!: User;

  ngOnInit(): void {
    this.stateService.getState().subscribe((state) => {
      this.state = state;
      this.currentUser = state.currentUser as User;
    });
    this.stateService.setDeleteCardState(true);
  }
}
