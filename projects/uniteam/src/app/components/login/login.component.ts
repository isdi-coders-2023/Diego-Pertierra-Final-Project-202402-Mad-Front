import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { StateService } from '../../core/services/state.service';
import { UserLoginDto } from '../../core/models/user.model';
import { Router, RouterModule } from '@angular/router';
import { SubmitBtnComponent } from '../shared/submit-btn/submit-btn.component';

@Component({
  selector: 'isdi-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, SubmitBtnComponent],
  template: `
    <form [formGroup]="formLogin" (ngSubmit)="submit()">
      <section>
        <a href="#" [routerLink]="'/landing'">
          <img
            src="assets/img/icons/close.svg"
            class="close-btn"
            alt="Icono de cerrar formulario"
            width="30"
          />
        </a>
        <h1>
          <img
            src="assets/img/logos/logo-with-text.svg"
            alt="Logo de Uniteam"
            width="80"
          />
        </h1>
        <h2>Inicio de sesión</h2>
        <p>
          ¿Aún no tienes usuario? <a [routerLink]="'/register'">Regístrate</a>
        </p>
      </section>
      <div>
        <label for="user"><h3>Usuario / Email</h3></label>
        <input
          id="user"
          type="text"
          placeholder="Introduce tu usuario o email"
          formControlName="user"
        />
      </div>
      <div class="password-control">
        <label for="password"><h3>Contraseña</h3></label>
        <input
          id="password"
          [type]="showPassword ? 'text' : 'password'"
          placeholder="Introduce tu contraseña"
          formControlName="password"
        />
        <button
          type="button"
          class="password-visibility"
          (click)="togglePasswordVisibility()"
        >
          <img
            src="assets/img/icons/{{
              showPassword ? 'see-password' : 'hide-password'
            }}.png"
            alt="Icono de mostrar u ocultar contraseña"
            width="25"
          />
        </button>
      </div>
      <div>
        <input id="remember" type="checkbox" />
        <label for="remember">Recuérdame</label>
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <isdi-submit-btn
        [label]="'Iniciar sesión'"
        [disabled]="formLogin.invalid"
      />
    </form>
  `,
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  private repo = inject(RepoUsersService);
  private state = inject(StateService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  errorMessage: string = '';
  formLogin = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    const { user, password } = this.formLogin.value;
    const userLogin = { password } as UserLoginDto;

    if (user!.includes('@')) {
      userLogin.email = this.formLogin.value.user as string;
    } else {
      userLogin.username = this.formLogin.value.user as string;
    }

    this.repo.login(userLogin).subscribe({
      next: ({ token }) => {
        this.state.setLogin(token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.state.setLoginState('error');
        this.errorMessage = 'Error: El usuario o la contraseña son incorrectos';
      },
    });
  }
}
