import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'isdi-error',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  template: `
    <section>
      <img src="assets/img/logos/logo.svg" alt="Logo de Uniteam" width="50" />
      <h2>OOPS</h2>
      <h3>ERROR 404</h3>
      <h3>No podemos encontrar lo que estabas buscando.</h3>
      <img src="assets/img/error.png" alt="Imagen de error" width="200" />
    </section>
    <section>
      <p>Algunos enlaces de ayuda:</p>
      <ul>
        <li><a href="#" [routerLink]="'/home'">Inicio</a></li>
        <li><a href="#" [routerLink]="'/events'">Eventos</a></li>
        <li><a href="#">Grupos</a></li>
        <li><a href="#" [routerLink]="'/profile'">Perfil</a></li>
      </ul>
      <isdi-button [label]="'VOLVER'" (click)="goBack()" />
    </section>
  `,
  styleUrl: './error.component.css',
})
export default class ErrorComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
