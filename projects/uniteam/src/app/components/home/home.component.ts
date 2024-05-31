import { Component, OnInit, inject } from '@angular/core';
import { StateService, State } from '../../core/services/state.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../core/models/user.model';
import { Router } from '@angular/router';
import { MeetListComponent } from '../meet-list/meet-list.component';
import { EmptyContentComponent } from '../empty-content/empty-content.component';

@Component({
  selector: 'isdi-home',
  standalone: true,
  template: `
    @if ( (stateService.getState() | async)!.loginState === 'logged') {
    <section>
      @if (currentUser) {
      <h2>
        Bienvenid&#64;, <strong>{{ currentUser.username }}</strong>
      </h2>
      }

      <h2>Tus quedadas</h2>
      @if (currentUser.joinedMeets) {
      <isdi-meet-list
        [meetList]="currentUser.joinedMeets"
        [cardDeleteState]="false"
      />
      @if (currentUser.joinedMeets.length === 0) {
      <isdi-empty-content [label]="'te has apuntado a ninguna quedada'" />
      }

      <h2>Tus quedadas guardadas</h2>
      @if(currentUser.savedMeets) {
      <isdi-meet-list
        [meetList]="currentUser.savedMeets"
        [cardDeleteState]="true"
      />
      @if (currentUser.savedMeets.length === 0) {
      <isdi-empty-content [label]="'has guardado ninguna quedada'" />
      } } }
    </section>
    }
  `,
  styleUrl: './home.component.css',
  imports: [AsyncPipe, MeetListComponent, EmptyContentComponent],
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
  }
}
