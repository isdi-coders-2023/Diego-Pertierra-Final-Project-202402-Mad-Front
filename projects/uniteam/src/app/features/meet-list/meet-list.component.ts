import { Component, Input } from '@angular/core';
import { MeetCardComponent } from '../meet-card/meet-card.component';
import { Meet } from '../../core/models/meet.model';

@Component({
  selector: 'isdi-meet-list',
  standalone: true,
  imports: [MeetCardComponent],
  template: `
    <ul class="meet-list">
      @for (meet of meetList; track $index) {
      <li>
        <isdi-meet-card [meetInfo]="meet" />
      </li>
      }
    </ul>
  `,
  styleUrl: './meet-list.component.css',
})
export class MeetListComponent {
  @Input() meetList!: Meet[];
}
