import { Component, OnInit, inject } from '@angular/core';
import { StateService, State } from '../../core/services/state.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { MeetListComponent } from '../meet-list/meet-list.component';

@Component({
  selector: 'isdi-home',
  standalone: true,
  imports: [AsyncPipe, MeetListComponent],
  template: `
    @if ( (stateService.getState() | async)!.loginState === 'logged') {
    <section>
      @if (currentUser) {
      <h2>
        Bienvenido, <strong>{{ currentUser.username }}</strong>
      </h2>
      }

      <h2>Tus quedadas</h2>
      <isdi-meet-list [meetList]="currentUser.joinedMeets" />

      <h2>Tus quedadas guardadas</h2>
      <isdi-meet-list [meetList]="currentUser.savedMeets" />
    </section>
    }
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
