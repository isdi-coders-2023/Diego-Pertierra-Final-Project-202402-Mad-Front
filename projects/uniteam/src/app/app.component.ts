import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { StateService } from './core/services/state.service';
import { HeaderComponent } from './features/shared/header/header.component';
import { FooterComponent } from './features/shared/footer/footer.component';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'isdi-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (shouldShowHeader()) {
    <isdi-header />
    }
    <router-outlet />
    @if (shouldShowFooter()) {
    <isdi-footer />
    }
  `,
  styles: ``,
})
export class AppComponent implements OnDestroy {
  stateService = inject(StateService);
  router = inject(Router);
  private navigationSubscription;

  constructor() {
    const stringToken = localStorage.getItem('TFD');
    if (stringToken) {
      const { token } = JSON.parse(stringToken);
      this.stateService.setLogin(token);
    }

    this.navigationSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {});

    console.log(environment.production);
  }

  shouldShowHeader(): boolean {
    const currentRoute = this.router.routerState.snapshot.url;
    return !['/landing', '/login', '/register', '/create-meet'].includes(
      currentRoute
    );
  }

  shouldShowFooter(): boolean {
    const currentRoute = this.router.routerState.snapshot.url;
    return !['/landing', '/login', '/register', '/create-meet'].includes(
      currentRoute
    );
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
