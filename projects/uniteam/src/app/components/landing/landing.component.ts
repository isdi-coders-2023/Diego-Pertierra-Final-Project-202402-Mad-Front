import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/button/button.component';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { AsyncPipe } from '@angular/common';
import { MeetListComponent } from '../meet-list/meet-list.component';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'isdi-landing',
  standalone: true,
  template: `
    <main>
      <section>
        <img
          src="../../../assets/img/logos/white-bg-logo.svg"
          alt="Uniteam logo"
          width="150"
        />
        <h1>SOMOS UNITEAM</h1>
        <isdi-button
          [label]="'Iniciar sesión'"
          tabindex="0"
          [routerLink]="'/login'"
          routerLinkActive="active"
        />
        <isdi-button
          [label]="'Registrarse'"
          tabindex="0"
          [routerLink]="'/register'"
          routerLinkActive="active"
        />
        <isdi-searchbar
          (searchSubmitted)="showMeetsSection()"
          [searchType]="'meets'"
          [placeholder]="'quedadas'"
        />
      </section>
      @if (showSection) {
      <section #meetSection>
        @if (state.getState() | async; as state) {
        <isdi-meet-list [meetList]="state.meets" [cardDeleteState]="false" />
        }
      </section>
      }
    </main>
  `,
  styleUrl: './landing.component.css',
  imports: [
    RouterModule,
    ButtonComponent,
    SearchbarComponent,
    AsyncPipe,
    MeetListComponent,
  ],
})
export default class LandingComponent {
  state = inject(StateService);
  @ViewChild('meetSection') meetSection!: ElementRef;
  showSection = false;

  showMeetsSection() {
    this.showSection = true;
    setTimeout(() => {
      if (this.meetSection && this.meetSection.nativeElement) {
        this.meetSection.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}
