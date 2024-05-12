import { Component, Input } from '@angular/core';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../core/models/event.model';

@Component({
  selector: 'isdi-event-list',
  standalone: true,
  imports: [EventCardComponent],
  template: `
    <ul class="event-list">
      @for (event of eventList; track $index) {
      <li>
        <isdi-event-card [eventInfo]="event" />
      </li>
      }
    </ul>
  `,
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  @Input() eventList!: Event[];
}
