import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StateService } from '../../core/services/state.service';

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
          placeholder="Buscar quedadas"
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

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.state.searchMeetsByTitle(this.searchTerm);
    } else {
      this.state.loadMeets();
    }
    this.searchSubmitted.emit();
  }
}
