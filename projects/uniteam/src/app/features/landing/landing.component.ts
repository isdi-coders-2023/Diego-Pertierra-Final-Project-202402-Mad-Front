import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'isdi-landing',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  template: `
    <main>
      <section>
        <img
          src="../../../assets/img/logos/white-bg-logo.svg"
          alt="Uniteam logo"
          width="150"
        />
        <h1>SOMOS UNITEAM</h1>
        <isdi-button
          [label]="'Iniciar sesión'"
          tabindex="0"
          [routerLink]="'/login'"
          routerLinkActive="active"
        />
        <isdi-button
          [label]="'Registrarse'"
          tabindex="0"
          [routerLink]="'/register'"
          routerLinkActive="active"
        />
        <h2>Aquí irá la barra de búsqueda</h2>
      </section>
    </main>
  `,
  styleUrl: './landing.component.css',
})
export default class LandingComponent {}
