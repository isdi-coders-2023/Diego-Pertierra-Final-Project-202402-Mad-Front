import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RepoUsersService } from '../../core/services/repo.users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'isdi-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h2>Registro de usuario</h2>
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div class="form-control">
        <label>
          <span>Nombre de usuario</span>
          <input type="text" formControlName="username" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Email</span>
          <input type="email" formControlName="email" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Contraseña</span>
          <input type="password" formControlName="password" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Avatar</span>
          <input type="file" #avatar (change)="onFileChange()" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Fecha de nacimiento</span>
          <input type="date" formControlName="birthDateString" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Ubicación</span>
          <input type="text" formControlName="location" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Género</span>
          <select name="gender" formControlName="gender">
            <option value="">--Elige una opción--</option>
            <option value="male">Masculino</option>
            <option value="female">Femenino</option>
            <option value="unspecified">Prefiero no especificar</option>
          </select>
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Bio</span>
          <input type="text" formControlName="bio" />
        </label>
      </div>
      <button type="submit" [disabled]="registerForm.invalid">Enviar</button>
    </form>
  `,
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  private fb = inject(FormBuilder);
  private repo = inject(RepoUsersService);
  private router = inject(Router);
  registerForm: FormGroup;
  @ViewChild('avatar') avatar!: ElementRef;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      avatar: [null],
      birthDateString: [''],
      location: [''],
      gender: ['', Validators.required],
      bio: [''],
    });
  }

  onFileChange() {
    const htmlElement: HTMLInputElement = this.avatar.nativeElement;
    const file = htmlElement.files![0];
    console.log(file);
    this.registerForm.patchValue({ avatar: file });
  }

  onSubmit() {
    console.log(this.registerForm.value);
    const fd = new FormData();
    fd.append('username', this.registerForm.value.username);
    fd.append('email', this.registerForm.value.email);
    fd.append('password', this.registerForm.value.password);
    fd.append('birthDateString', this.registerForm.value.birthDateString);
    fd.append('avatar', this.registerForm.value.avatar);
    fd.append('location', this.registerForm.value.location);
    fd.append('gender', this.registerForm.value.gender);
    fd.append('bio', this.registerForm.value.bio);

    return this.repo.create(fd).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/login']);
    });
  }
}
