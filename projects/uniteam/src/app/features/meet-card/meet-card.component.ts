import { Component, Input, OnInit, inject } from '@angular/core';
import { Meet } from '../../core/models/meet.model';
import { StateService } from '../../core/services/state.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'isdi-meet-card',
  standalone: true,
  imports: [],
  template: `
    @if (meetInfo) {
    <article
      class="meet-card"
      [style.background]="
        'linear-gradient(0deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.1)), url(' +
        this.state.constructImageUrl(meetInfo.image, '300', '300') +
        ')'
      "
    >
      <ul class="meet-card-content">
        <li class="meet-filters">
          <span>{{
            meetInfo.sport.charAt(0).toUpperCase() + meetInfo.sport.slice(1)
          }}</span>
        </li>
        @if (this.state.getDeleteCardState()) {
        <img
          src="assets/img/icons/close-w.svg"
          alt="Icono de eliminar tarjeta"
          width="25"
          class="card-close-btn"
          tabindex="0"
          role="button"
          (click)="this.state.deleteMeet(currentUser.id, meetInfo.id)"
          (keyup)="this.state.deleteMeet(currentUser.id, meetInfo.id)"
        />
        }
        <li>
          <ul>
            <li>{{ meetInfo.date }}</li>
            <li>
              <h2>{{ meetInfo.title }}</h2>
            </li>
            <li>
              <p>{{ meetInfo.location }}</p>
            </li>
            <li class="card-attendees">
              @if (meetInfo.attendees) {
              <span>{{ meetInfo.attendees.length }} apuntados</span>
              }
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
                  tabindex="0"
                  role="button"
                  (click)="this.state.saveMeet(currentUser.id, meetInfo.id)"
                  (keyup)="this.state.saveMeet(currentUser.id, meetInfo.id)"
                />
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </article>
    }
  `,
  styleUrl: './meet-card.component.css',
})
export class MeetCardComponent implements OnInit {
  state = inject(StateService);
  @Input() meetInfo!: Meet;
  currentUser!: User;

  ngOnInit(): void {
    this.state.getState().subscribe((data) => {
      this.currentUser = data.currentUser as User;
    });
  }
}
