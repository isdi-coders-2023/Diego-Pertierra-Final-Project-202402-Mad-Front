import { Component, OnInit, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { MeetListComponent } from '../meet-list/meet-list.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'isdi-meets',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MeetListComponent, AsyncPipe],
  template: `
    <isdi-header />
    <h2>Todas las quedadas</h2>
    @if (state.getState() | async; as state) {
    <isdi-meet-list [meetList]="state.meets" />
    }

    <isdi-footer />
  `,
  styleUrl: './meets.component.css',
})
export default class MeetsComponent implements OnInit {
  state = inject(StateService);

  ngOnInit() {
    this.state.loadMeets();
    this.state.setDeleteCardState(false);
  }
}
