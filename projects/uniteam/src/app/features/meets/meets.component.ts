import { Component, OnInit, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { MeetListComponent } from '../meet-list/meet-list.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'isdi-meets',
  standalone: true,
  imports: [MeetListComponent, AsyncPipe],
  template: `
    <h2>Todas las quedadas</h2>
    @if (state.getState() | async; as state) {
    <isdi-meet-list [meetList]="state.meets" [cardDeleteState]="false"/>
    }
  `,
  styleUrl: './meets.component.css',
})
export default class MeetsComponent implements OnInit {
  state = inject(StateService);

  ngOnInit() {
    this.state.loadMeets();
  }
}
