import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';

type SearchType = 'meets' | 'users';

@Component({
  selector: 'isdi-searchbar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="wrap">
      <form class="search" (submit)="onSearch($event)">
        <input
          type="text"
          class="searchTerm"
          placeholder="Buscar {{ placeholder }}"
          [(ngModel)]="searchTerm"
          name="searchTerm"
        />
        <button type="submit" class="searchButton">
          <img src="assets/img/icons/search.svg" alt="Botón de buscar" />
        </button>
      </form>
    </div>
  `,
  styleUrl: './searchbar.component.css',
})
export class SearchbarComponent {
  private state = inject(StateService);
  @Output() searchSubmitted = new EventEmitter<void>();
  searchTerm: string = '';
  @Input() searchType!: SearchType;
  @Input() placeholder!: string;

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchType === 'meets') {
      if (this.searchTerm.trim()) {
        this.state.searchMeetsByTitle(this.searchTerm);
      } else {
        this.state.loadMeets();
      }
    } else if (this.searchType === 'users') {
      if (this.searchTerm.trim()) {
        this.state.searchUsers(this.searchTerm);
      } else {
        this.state.fetchAndSortUsers();
      }
    }

    this.searchSubmitted.emit();
  }
}
