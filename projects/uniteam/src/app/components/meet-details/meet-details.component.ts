import { Component, OnInit, inject } from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { Meet } from '../../core/models/meet.model';
import { ActivatedRoute } from '@angular/router';
import { UserOptionsComponent } from '../shared/user-options/user-options.component';
import { User } from '../../core/models/user.model';
import { ButtonComponent } from '../shared/button/button.component';
import { ProfileAvatarComponent } from '../shared/profile-avatar/profile-avatar.component';
import { DatePipe } from '@angular/common';
import { CapitalizeFirstPipe } from '../../core/pipes/capitalize-first.pipe';

@Component({
  selector: 'isdi-meet-details',
  standalone: true,
  template: `
    @if (meetDetails) {
    <article class="meet-details-body">
      <section>
        <h2>{{ meetDetails.title }}</h2>
        <div class="user-info">
          @if (meetDetails.creator.avatar) {
          <img
            src="{{
              this.stateSrv.constructImageUrl(
                meetDetails.creator.avatar!,
                '50',
                '50'
              )
            }}"
            alt="Avatar del usuario"
          />
          }
          <h3>{{ meetDetails.creator.username }}</h3>
        </div>
      </section>
      <section class="main-section">
        <div class="meet-img-container">
          <img
            src="{{
              this.stateSrv.constructImageUrl(meetDetails.image, '600', '600')
            }}"
            alt="Imagen de la quedada"
            class="meet-img"
          />
        </div>
        <div>
          <section>
            <div class="details-container">
              <img
                src="assets/img/icons/date.svg"
                alt="Icono de fecha"
                width="25"
              />
              <p>
                {{ meetDetails.date | date : 'fullDate' | capitalizeFirst }}
              </p>
            </div>
            <div class="details-container">
              <img
                src="assets/img/icons/location.svg"
                alt="Icono de ubicación"
                width="25"
              />
              <p>{{ meetDetails.location }}</p>
            </div>
          </section>
          <section>
            <h3>Descripción</h3>
            <p>{{ meetDetails.description }}</p>
          </section>
        </div>
      </section>
      <section>
        <h3>Asistentes</h3>
        @if(!meetDetails.attendees) {
        <p>Aún no hay ningún asistente para este evento</p>
        } @else {
        <ul class="attendees">
          @for (attendee of meetDetails.attendees; track $index) {
          <li>
            @if (attendee.avatar) {
            <isdi-profile-avatar
              [avatar]="attendee.avatar"
              [width]="'60'"
              [height]="'60'"
            />
            }
          </li>
          }
        </ul>
        }
      </section>
    </article>
    <isdi-user-options [user]="currentUser" [meetDetails]="meetDetails" />
    }
  `,
  styleUrl: './meet-details.component.css',
  imports: [
    DatePipe,
    UserOptionsComponent,
    ButtonComponent,
    ProfileAvatarComponent,
    CapitalizeFirstPipe,
  ],
})
export default class MeetDetailsComponent implements OnInit {
  stateSrv = inject(StateService);
  route = inject(ActivatedRoute);
  meetDetails!: Meet;
  id!: string;
  currentUser!: User;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];

      this.stateSrv.getState().subscribe((state) => {
        this.currentUser = state.currentUser as User;
      });
    });

    this.stateSrv.loadMeetById(this.id).subscribe({
      next: (meet) => {
        this.meetDetails = meet;
      },
      error: (err) => {
        console.error('Failed to load meet:', err);
      },
    });
  }
}
