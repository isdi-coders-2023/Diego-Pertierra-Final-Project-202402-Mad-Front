import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { StateService } from '../../core/services/state.service';
import { User, UserUpdateDto } from '../../core/models/user.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubmitBtnComponent } from '../shared/submit-btn/submit-btn.component';
import { InfoModalComponent } from '../shared/info-modal/info-modal.component';
import { ButtonComponent } from '../shared/button/button.component';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'isdi-profile',
  standalone: true,
  template: `
    <div class="profile-container">
      <h2>Tu perfil</h2>
      <ul class="user-info">
        @if (currentUser) {
        <li>
          <strong>{{ currentUser.createdMeets.length }}</strong>
          <h3>QUEDADAS CREADAS</h3>
        </li>
        <li>
          <strong>{{ currentUser.joinedMeets.length }}</strong>
          <h3>QUEDADAS ATENDIDAS</h3>
        </li>
        <li>
          <strong>{{ currentUser.savedMeets.length }}</strong>
          <h3>QUEDADAS GUARDADAS</h3>
        </li>
        <li>
          <strong>{{ currentUser.friends!.length }}</strong>
          <h3>AMIGOS</h3>
        </li>
        }
      </ul>
      @if(currentUser) {
      <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
        <section>
          @if (imageUrl) {
          <div class="img-container">
            <img src="{{ imageUrl }}" alt="Imagen de perfil" />
          </div>
          }
          <input type="file" #avatar (change)="onFileChange()" />
        </section>
        <section class="form-control">
          <label>
            <span>Nombre de usuario</span>
            <input type="text" formControlName="username" />
          </label>
        </section>
        <section class="form-control password-control">
          <label>
            <span>Contraseña</span>
            <input
              [type]="showPassword ? 'text' : 'password'"
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
          </label>
        </section>
        <section class="form-control">
          <label>
            <span>Ubicación</span>
            <input type="text" formControlName="location" />
          </label>
        </section>
        <section class="form-control">
          <label>
            <span>Fecha de nacimiento</span>
            <p>Fecha actual: {{ state.formatDate(currentUser.birthDate) }}</p>
            <input type="date" formControlName="birthDate" />
          </label>
        </section>
        <section class="form-control">
          <label>
            <span>Bio</span>
            <input type="text" formControlName="bio" />
          </label>
        </section>
        <isdi-submit-btn [label]="'Guardar cambios'" />
      </form>
      <section class="friends-section">
        <h2>Tus amigos</h2>
        <div class="friends-container">
          @if (currentUser.friends!.length > 0) { @for (friend of
          currentUser.friends; track $index) {
          <div class="friend">
            @if (friend.avatar) {
            <img
              src="{{ state.constructImageUrl(friend.avatar, '50', '50') }}"
              alt="Imagen de amigo"
            />
            }
            <h3>{{ friend.username }}</h3>
            <button (click)="state.deleteFriend(currentUser, friend.id)">
              <img
                src="assets/img/icons/close-red.svg"
                alt="Icono de eliminar usuario"
                class="close-btn"
                width="25"
              />
            </button>
          </div>
          } }
        </div>
      </section>
      <isdi-info-modal
        [isModalOpen]="showModal"
        [content]="'Usuario actualizado correctamente'"
        (closeModalEvent)="showModal = false"
      />
      <isdi-button
        [label]="'Eliminar cuenta'"
        [backgroundColor]="'rgb(200, 51, 51)'"
        (click)="openConfirmationModal()"
      />
      @if (showConfirmationModal) {
      <isdi-confirmation-modal
        (confirmed)="onDeleteConfirmed(currentUser.id)"
        (canceled)="onCancelDelete()"
      />
      } }
    </div>
  `,
  styleUrl: './profile.component.css',
  imports: [
    ReactiveFormsModule,
    SubmitBtnComponent,
    InfoModalComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})
export default class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  state = inject(StateService);
  private router = inject(Router);
  currentUser!: User;
  profileForm!: FormGroup;
  imageUrl: string | undefined = undefined;
  @ViewChild('avatar') avatar!: ElementRef;
  showModal = false;
  showConfirmationModal = false;
  showPassword = false;

  ngOnInit() {
    this.state.getState().subscribe((state) => {
      this.currentUser = state.currentUser as User;
      this.initializeForm(this.currentUser);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  initializeForm(user: UserUpdateDto) {
    if (this.currentUser) {
      this.imageUrl = user.avatar;
      this.profileForm = this.fb.group({
        username: [user.username, Validators.required],
        email: [user.email, [Validators.required, Validators.email]],
        password: [user.password],
        avatar: [user.avatar],
        birthDate: [user.birthDate],
        location: [user.location],
        bio: [user.bio],
      });
    }
  }

  onFileChange() {
    const htmlElement: HTMLInputElement = this.avatar.nativeElement;
    const file = htmlElement.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.profileForm.patchValue({ avatar: file });
  }

  onSubmit() {
    console.log(this.profileForm.value);
    const fd = new FormData();
    fd.append('username', this.profileForm.value.username);
    fd.append('email', this.profileForm.value.email);
    fd.append('password', this.profileForm.value.password);
    fd.append('birthDate', this.profileForm.value.birthDate);
    fd.append('avatar', this.profileForm.value.avatar);
    fd.append('location', this.profileForm.value.location);
    fd.append('bio', this.profileForm.value.bio);

    return this.state.updateUser(fd, this.currentUser.id).subscribe({
      next: (user) => {
        console.log('User updated successfully', user);
        this.showModal = true;
      },
    });
  }

  deleteUser(userId: string) {
    this.state.deleteUser(userId);
    this.router.navigate(['/landing']);
  }

  openConfirmationModal() {
    this.showConfirmationModal = true;
  }

  onDeleteConfirmed(userId: string) {
    this.showConfirmationModal = false;
    this.deleteUser(userId);
  }

  onCancelDelete() {
    this.showConfirmationModal = false;
  }
}
