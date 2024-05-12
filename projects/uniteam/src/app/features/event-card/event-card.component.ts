import { Component, Input, inject } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'isdi-event-card',
  standalone: true,
  imports: [],
  template: `
    @if (eventInfo) {
    <article
      class="event-card"
      [style.background]="
        'linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1)), url(' +
        this.state.constructImageUrl(eventInfo.image, '300', '300') +
        ')'
      "
    >
      <ul class="event-card-content">
        <li class="event-filters">
          <span>{{
            eventInfo.sport.charAt(0).toUpperCase() + eventInfo.sport.slice(1)
          }}</span>
        </li>
        <section>
          <li>{{ eventInfo.date }}</li>
          <li>
            <h2>{{ eventInfo.title }}</h2>
          </li>
          <li>
            <p>{{ eventInfo.location }}</p>
          </li>
          <li class="card-attendees">
            <span>{{ eventInfo.attendees.length }} apuntados</span>
            <div>
              <img
                src="assets/img/icons/send.svg"
                alt="Icono de enviar"
                width="30"
              />
              <img
                src="assets/img/icons/save.svg"
                alt="Icono de guardar"
                width="30"
              />
            </div>
          </li>
        </section>
      </ul>
    </article>
    }
  `,
  styleUrl: './event-card.component.css',
})
export class EventCardComponent {
  state = inject(StateService);
  @Input() eventInfo!: Event;
}
