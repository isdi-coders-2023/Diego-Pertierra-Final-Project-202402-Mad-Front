import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../core/models/user.model';
import { ProfileAvatarComponent } from '../shared/profile-avatar/profile-avatar.component';
import { StateService } from '../../core/services/state.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';

@Component({
  selector: 'isdi-users',
  standalone: true,
  template: `
    <h2>Usuarios ({{ userList.length }})</h2>
    <isdi-searchbar [searchType]="'users'" [placeholder]="'usuarios'" />
    @for (user of userList; track $index) {
    <article>
      <div>
        <isdi-profile-avatar
          [avatar]="user.avatar"
          [height]="'50'"
          [width]="'50'"
        />
        <h3>{{ user.username }}</h3>
      </div>
      @if (currentUser && user.id !== currentUser.id) { @if
      (!state.isFriend(currentUser, user.id)) {
      <button (click)="state.addFriend(currentUser, user.id)">
        <img
          src="assets/img/icons/add.svg"
          alt="Icono de añadir amigo"
          width="40"
        />
      </button>
      } @else {
      <img
        src="assets/img/icons/check.svg"
        alt="El usuario es amigo"
        width="40"
      />
      } }
    </article>
    }
  `,
  styleUrl: './users.component.css',
  imports: [ProfileAvatarComponent, SearchbarComponent],
})
export default class UsersComponent implements OnInit {
  protected state = inject(StateService);
  currentUser!: User;
  userList!: User[];

  ngOnInit() {
    this.state.fetchAndSortUsers();
    this.state.getState().subscribe((state) => {
      this.userList = state.users;
      this.currentUser = state.currentUser as User;
    });
  }
}
