import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { StateService, State } from '../../../core/services/state.service';
import { Router, Routes, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let stateServiceMock: jasmine.SpyObj<StateService>;
  let router: Router;

  beforeEach(async () => {
    stateServiceMock = jasmine.createSpyObj('StateService', [
      'getState',
      'setLogout',
      'setRoutes',
      'constructImageUrl',
    ]);

    stateServiceMock.getState.and.returnValue(
      of({
        loginState: 'logged',
        currentUser: {
          name: 'Test User',
          avatar: 'path_to_avatar.jpg',
        },
      } as State)
    );

    stateServiceMock.constructImageUrl.and.returnValue('valid_avatar_url');

    await TestBed.configureTestingModule({
      imports: [MenuComponent, HttpClientTestingModule],
      providers: [
        provideRouter([] as Routes),
        { provide: StateService, useValue: stateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isMobile when window is resized', () => {
    spyOn(component, 'checkViewport').and.callThrough();
    const mockEvent = new Event('resize');
    window.dispatchEvent(mockEvent);
    expect(component.checkViewport).toHaveBeenCalled();
  });

  it('should toggle mobile menu', () => {
    component.isMobileMenuOpen = false;
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeTrue();
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBeFalse();
  });

  it('should toggle profile menu', () => {
    component.isProfileMenuOpen = false;
    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen).toBeTrue();
    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen).toBeFalse();
  });

  it('should call setLogout on logout', () => {
    component.logout();
    expect(stateServiceMock.setLogout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle profile menu', () => {
    expect(component.isProfileMenuOpen).toBeFalsy();
    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen).toBeTruthy();
  });

  it('should update profile menu class when opening', () => {
    expect(component.profileMenuClass).toBe('profile-menu');
    component.toggleProfileMenu();
    expect(component.profileMenuClass).toBe('profile-menu open');
  });

  it('should update profile menu class when closing', () => {
    component.isProfileMenuOpen = true;
    component.toggleProfileMenu();
    expect(component.profileMenuClass).toBe('profile-menu');
  });
});
