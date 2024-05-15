import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetListComponent } from './meet-list.component';

describe('MeetListComponent', () => {
  let component: MeetListComponent;
  let fixture: ComponentFixture<MeetListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
