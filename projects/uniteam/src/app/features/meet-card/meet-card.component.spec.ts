import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCardComponent } from './meet-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MeetCardComponent', () => {
  let component: MeetCardComponent;
  let fixture: ComponentFixture<MeetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetCardComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
