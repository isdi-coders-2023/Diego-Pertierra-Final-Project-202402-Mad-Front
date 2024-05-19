import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirmed event when confirm button is clicked', () => {
    spyOn(component.confirmed, 'emit');

    const confirmButtonDebugEl = fixture.debugElement.query(
      By.css('isdi-button:first-of-type')
    );
    const confirmButtonEl =
      confirmButtonDebugEl.nativeElement.querySelector('button');
    confirmButtonEl.click();

    expect(component.confirmed.emit).toHaveBeenCalled();
  });

  it('should emit canceled event when cancel button is clicked', () => {
    spyOn(component.canceled, 'emit');

    const cancelButtonDebugEl = fixture.debugElement.query(
      By.css('isdi-button:last-of-type')
    );
    const cancelButtonEl =
      cancelButtonDebugEl.nativeElement.querySelector('button');
    cancelButtonEl.click();

    expect(component.canceled.emit).toHaveBeenCalled();
  });
});
