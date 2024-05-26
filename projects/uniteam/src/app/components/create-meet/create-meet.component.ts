import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SubmitBtnComponent } from '../shared/submit-btn/submit-btn.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RepoMeetsService } from '../../core/services/repo-meets.service';

@Component({
  selector: 'isdi-create-meet',
  standalone: true,
  template: `
    <form [formGroup]="meetForm" (ngSubmit)="onSubmit()">
      <a href="#" [routerLink]="'/meets'">
        <img
          src="assets/img/icons/close.svg"
          class="close-btn"
          alt="Icono de cerrar formulario"
          width="35"
        />
      </a>
      <h2>Nueva quedada</h2>
      <div class="form-control">
        <label>
          <span>Título de quedada</span>
          <input type="text" formControlName="title" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Descripción</span>
          <input type="text" formControlName="description" />
        </label>
      </div>
      <div class="form-control file-control">
        <label>
          <span>Imagen</span>
          <input
            class="custom-file-input"
            type="file"
            #image
            (change)="onFileChange()"
          />
        </label>
        @if (imageUrl) {
        <div class="input-img-container">
          <img class="input-img" src="{{ imageUrl }}" alt="Selected Image" />
        </div>
        }
      </div>
      <div class="form-control">
        <label>
          <span>Lugar</span>
          <input type="text" formControlName="location" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Deporte</span>
          <input type="text" formControlName="sport" />
        </label>
      </div>
      <div class="form-control">
        <label>
          <span>Fecha</span>
          <input type="date" formControlName="date" />
        </label>
      </div>
      <isdi-submit-btn
        [label]="'Crear quedada'"
        [disabled]="meetForm.invalid"
      />
    </form>
  `,
  styleUrl: './create-meet.component.css',
  imports: [RouterModule, SubmitBtnComponent, ReactiveFormsModule],
})
export default class CreateMeetComponent {
  private fb = inject(FormBuilder);
  private repo = inject(RepoMeetsService);
  private router = inject(Router);
  meetForm: FormGroup;
  imageUrl: string | null = null;
  @ViewChild('image') image!: ElementRef;

  constructor() {
    this.imageUrl =
      'https://res.cloudinary.com/dehkeqyua/image/upload/w_200,h_200,c_fill/v1715275478/uniteam/empty';
    this.meetForm = this.fb.group({
      title: [''],
      description: [''],
      image: [null],
      location: [''],
      sport: ['', Validators.required],
      date: [null],
    });
  }

  onFileChange() {
    const htmlElement: HTMLInputElement = this.image.nativeElement;
    const file = htmlElement.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.meetForm.patchValue({ image: file });
  }

  onSubmit() {
    console.log(this.meetForm.value);
    const fd = new FormData();
    fd.append('title', this.meetForm.value.title);
    fd.append('description', this.meetForm.value.description);
    fd.append('image', this.meetForm.value.image);
    fd.append('location', this.meetForm.value.location);
    fd.append('sport', this.meetForm.value.sport);
    fd.append('date', this.meetForm.value.date);

    return this.repo.create(fd).subscribe((data) => {
      console.log(data);
      this.router.navigate(['/meets']);
    });
  }
}
