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
      <div>
        <label for="password"><h3>Contraseña</h3></label>
        <input
          id="password"
          type="password"
          placeholder="Introduce tu contraseña"
          formControlName="password"
        />
      </div>
      <div>
        <input id="remember" type="checkbox" />
        <label for="remember">Recuérdame</label>
      </div>
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
  formLogin = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

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
        console.log('Logged in', token);
      },
      error: (err) => {
        console.error(err);
        this.state.setLoginState('error');
      },
    });

    this.router.navigate(['/home']);
  }
}
