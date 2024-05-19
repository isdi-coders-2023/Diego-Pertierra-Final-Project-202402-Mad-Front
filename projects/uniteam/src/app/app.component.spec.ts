import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateService } from './core/services/state.service';
import { Routes, provideRouter } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ token: 'mockToken' })
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [provideRouter([] as Routes), StateService],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
