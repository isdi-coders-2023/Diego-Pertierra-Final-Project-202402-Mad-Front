import { Component, Input, OnChanges, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { User } from '../../../core/models/user.model';
import { StateService } from '../../../core/services/state.service';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { Location } from '@angular/common';
import { Meet } from '../../../core/models/meet.model';

@Component({
  selector: 'isdi-user-options',
  standalone: true,
  imports: [ButtonComponent, ProfileAvatarComponent],
  template: `
    <div class="user-options">
      <isdi-profile-avatar
        [width]="'50'"
        [height]="'50'"
        [avatar]="user.avatar"
      />
      @if (!hasMeet) {
      <isdi-button [label]="'Apúntate'" (click)="onClickJoin()" />
      }@else {
      <isdi-button
        [label]="'Salirse'"
        (click)="onClickLeave()"
        [backgroundColor]="'rgb(200, 51, 51)'"
      />
      }
      <img
        src="assets/img/icons/back.svg"
        alt="Botón de volver"
        width="25"
        tabindex="0"
        (click)="backClicked()"
        (keyup)="backClicked()"
      />
    </div>
  `,
  styleUrl: './user-options.component.css',
})
export class UserOptionsComponent implements OnChanges {
  location = inject(Location);
  state = inject(StateService);
  @Input() user!: User;
  @Input() meetDetails!: Meet;
  hasMeet!: boolean;

  ngOnChanges() {
    this.hasMeet = this.state.hasMeet(this.user, this.meetDetails.id);
  }

  backClicked() {
    this.location.back();
  }

  onClickJoin() {
    this.state.joinMeet(this.user.id, this.meetDetails.id);
  }

  onClickLeave() {
    this.state.leaveMeet(this.user.id, this.meetDetails.id);
  }
}
