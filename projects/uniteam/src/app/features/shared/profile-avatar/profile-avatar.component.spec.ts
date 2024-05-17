import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatarComponent } from './profile-avatar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileAvatarComponent', () => {
  let component: ProfileAvatarComponent;
  let fixture: ComponentFixture<ProfileAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAvatarComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
