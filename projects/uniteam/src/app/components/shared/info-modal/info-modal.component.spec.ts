import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModalComponent } from './info-modal.component';
import { By } from '@angular/platform-browser';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the modal when isModalOpen is true', () => {
    component.isModalOpen = true;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(
      By.css('.modal')
    ).nativeElement;
    expect(modalElement.style.display).toBe('flex');
  });

  it('should hide the modal when isModalOpen is false', () => {
    component.isModalOpen = false;
    fixture.detectChanges();

    const modalElement = fixture.debugElement.query(
      By.css('.modal')
    ).nativeElement;
    expect(modalElement.style.display).toBe('none');
  });

  it('should emit closeModalEvent when close button is clicked', () => {
    spyOn(component.closeModalEvent, 'emit');

    component.isModalOpen = true;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(
      By.css('.modal-close')
    ).nativeElement;
    closeButton.click();

    expect(component.closeModalEvent.emit).toHaveBeenCalled();
  });
});
