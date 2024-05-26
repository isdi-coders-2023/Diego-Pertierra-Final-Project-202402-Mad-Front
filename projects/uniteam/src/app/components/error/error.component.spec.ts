import { ComponentFixture, TestBed } from '@angular/core/testing';
import ErrorComponent from './error.component';
import { provideRouter } from '@angular/router';
import { Location } from '@angular/common';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        provideRouter([]),
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go back', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
