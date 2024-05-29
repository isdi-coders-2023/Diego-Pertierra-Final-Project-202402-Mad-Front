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
    <isdi-searchbar [searchType]="'users'" />
    @for (user of userList; track $index) {
    <article>
      <isdi-profile-avatar
        [avatar]="user.avatar"
        [height]="'50'"
        [width]="'50'"
      />
      <h3>{{ user.username }}</h3>
    </article>
    }
  `,
  styleUrl: './users.component.css',
  imports: [ProfileAvatarComponent, SearchbarComponent],
})
export default class UsersComponent implements OnInit {
  private state = inject(StateService);
  userList!: User[];

  ngOnInit() {
    this.state.fetchAndSortUsers();
    this.state.getState().subscribe((state) => {
      this.userList = state.users;
    });
  }
}
