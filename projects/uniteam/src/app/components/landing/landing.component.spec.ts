import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import LandingComponent from './landing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ElementRef } from '@angular/core';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show meets section when search is submitted', fakeAsync(() => {
    component.showMeetsSection();

    tick(500);

    expect(component.showSection).toBeTrue();
  }));

  it('should show meets section when search is submitted and scroll to it', fakeAsync(() => {
    const scrollIntoViewSpy = spyOn(window.Element.prototype, 'scrollIntoView');

    component.meetSection = {
      nativeElement: {
        scrollIntoView: scrollIntoViewSpy,
      } as unknown as HTMLElement,
    } as ElementRef;

    component.showMeetsSection();

    tick(500);

    expect(component.showSection).toBeTrue();

    expect(scrollIntoViewSpy).toHaveBeenCalled();
  }));
});
