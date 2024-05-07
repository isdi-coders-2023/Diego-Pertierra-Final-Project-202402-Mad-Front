import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { StateService } from '../../core/services/state.service';
import { UserLoginDto } from '../../core/models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'isdi-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <form [formGroup]="formLogin" (ngSubmit)="submit()">
      <section>
        <h1>
          <img src="assets/img/logo-with-text.svg" alt="Logo de Uniteam" />
        </h1>
        <h2>Inicio de sesión</h2>
        <p>
          ¿Aún no tienes usuario? <a [routerLink]="'/register'">Regístrate</a>
        </p>
      </section>
      <div>
        <label for="user"><h3>Usuario / Email</h3></label>
        <input id="user" type="text" formControlName="user" />
      </div>
      <div>
        <label for="password"><h3>Contraseña</h3></label>
        <input id="password" type="password" formControlName="password" />
      </div>

      <button type="submit" [disabled]="formLogin.invalid">
        Iniciar sesión
      </button>
      <div>
        <input id="remember" type="checkbox" />
        <label for="remember">Recuérdame</label>
      </div>
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
