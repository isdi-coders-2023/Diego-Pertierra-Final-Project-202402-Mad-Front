import { ComponentFixture, TestBed } from '@angular/core/testing';

import MeetDetailsComponent from './meet-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('MeetDetailsComponent', () => {
  let component: MeetDetailsComponent;
  let fixture: ComponentFixture<MeetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetDetailsComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
