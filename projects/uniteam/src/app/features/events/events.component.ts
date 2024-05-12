import { Component, OnInit, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { Event } from '../../core/models/event.model';
import { EventListComponent } from '../event-list/event-list.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'isdi-events',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, EventListComponent],
  template: `
    <isdi-header />
    <h2>Todos los eventos</h2>
    <isdi-event-list [eventList]="eventList" />
    <isdi-footer />
  `,
  styleUrl: './events.component.css',
})
export default class EventsComponent implements OnInit {
  state = inject(StateService);
  eventList!: Event[];

  ngOnInit() {
    this.state.getEvents().subscribe((events) => {
      this.eventList = events;
    });
  }
}
