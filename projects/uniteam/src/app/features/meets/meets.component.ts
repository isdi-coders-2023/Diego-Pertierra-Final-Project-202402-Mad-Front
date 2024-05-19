import { Component, OnInit, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { MeetListComponent } from '../meet-list/meet-list.component';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'isdi-meets',
  standalone: true,
  template: `
    <div>
      <h2>Todas las quedadas</h2>
      <button [routerLink]="'/create-meet'">Crear quedada</button>
    </div>
    @if (state.getState() | async; as state) {
    <isdi-meet-list [meetList]="state.meets" [cardDeleteState]="false" />
    }
  `,
  styleUrl: './meets.component.css',
  imports: [MeetListComponent, AsyncPipe, RouterModule],
})
export default class MeetsComponent implements OnInit {
  state = inject(StateService);

  ngOnInit() {
    this.state.loadMeets();
  }
}
