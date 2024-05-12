import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuOption } from '../../../core/models/menu-option';
import { StateService, UserState } from '../../../core/services/state.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'isdi-menu',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav>
      <a href="#" [routerLink]="'/home'">
        <img
          class="logo"
          src="assets/img/logos/logo.svg"
          alt="Logo de Uniteam"
          width="50"
        />
      </a>
      @if (isMobile) {
      <img
        class="hamburger-icon"
        src="assets/img/icons/hamburger.svg"
        alt="Icono de menú hamburguesa"
        width="40"
        tabindex="0"
        (click)="toggleMobileMenu()"
        (keyup)="toggleMobileMenu()"
        role="button"
      />
      <ul [class]="mobileMenuClass">
        <img
          class="close-icon"
          src="assets/img/icons/close.svg"
          alt="Icono de cerrar"
          width="40"
          tabindex="0"
          (click)="toggleMobileMenu()"
          (keyup)="toggleMobileMenu()"
          role="button"
        />
        @for (item of items; track $index) { @if (item.path !== 'landing' &&
        item.path !== 'error') {
        <li>
          <a [routerLink]="'/' + item.path" routerLinkActive="active">{{
            item.title
          }}</a>
        </li>
        } }
        <hr />
        <li>
          <ul class="profile-links">
            <li><a href="#">Perfil</a></li>
            <li><a href="#">Amigos</a></li>
            <li><a href="#">Mensajes</a></li>
          </ul>
        </li>
        <li class="user-flex">
          <img
            src="{{
              this.stateService.constructImageUrl(
                currentUser.avatar,
                '60',
                '60'
              )
            }}"
            alt="Imagen del usuario"
          />
          <a class="logout" href="#" (click)="logout()">Cerrar sesión</a>
        </li>
      </ul>
      } @else {
      <ul class="desktop-menu">
        <div class="desktop-links">
          @for (item of items; track $index) { @if (item.path !== 'landing') {
          <li>
            <a [routerLink]="'/' + item.path" routerLinkActive="active">{{
              item.title
            }}</a>
          </li>
          } }
          <img
            class="profile-img"
            src="{{
              this.stateService.constructImageUrl(
                currentUser.avatar,
                '200',
                '200'
              )
            }}"
            alt="Imagen de perfil"
            width="40"
            tabindex="0"
            (click)="toggleProfileMenu()"
            (keyup)="toggleProfileMenu()"
            role="button"
          />
          <ul [class]="profileMenuClass">
            <li><a href="#">Perfil</a></li>
            <li><a href="#">Amigos</a></li>
            <li><a href="#">Mensajes</a></li>
            <li>
              <a
                class="logout"
                tabindex="0"
                (click)="logout()"
                (keyup)="logout()"
              >
                Cerrar sesión
              </a>
            </li>
          </ul>
        </div>
      </ul>
      }
    </nav>
  `,
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  router = inject(Router);
  stateService = inject(StateService);
  state!: UserState;
  currentUser!: User;
  @Input({
    required: true,
  })
  items: MenuOption[] = [];
  isMobile: boolean = false;
  isMobileMenuOpen: boolean = false;
  mobileMenuClass: string = 'mobile-menu';
  isProfileMenuOpen: boolean = false;
  profileMenuClass: string = 'profile-menu';

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  ngOnInit() {
    this.checkViewport();
    this.stateService.getUserState().subscribe((state) => {
      this.state = state;
      this.currentUser = state.currentUser as User;
    });
  }

  checkViewport() {
    this.isMobile = window.innerWidth < 600;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateMobileMenuClass();
  }

  updateMobileMenuClass() {
    if (this.isMobileMenuOpen) {
      this.mobileMenuClass = 'mobile-menu open';
    } else {
      this.mobileMenuClass = 'mobile-menu';
    }
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.updateProfileMenuClass();
  }

  updateProfileMenuClass() {
    if (this.isProfileMenuOpen) {
      this.profileMenuClass = 'profile-menu open';
    } else {
      this.profileMenuClass = 'profile-menu';
    }
  }

  logout() {
    this.stateService.setLogout();
    this.router.navigate(['/login']);
  }
}
