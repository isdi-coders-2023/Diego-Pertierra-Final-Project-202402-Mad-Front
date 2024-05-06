import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'isdi-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <main>
      <section>
        <img
          src="../../../assets/img/white-bg-logo.svg"
          alt="Uniteam logo"
          width="150"
        />
        <h1>SOMOS UNITEAM</h1>
        <a tabindex="0" [routerLink]="'/login'" routerLinkActive="active">
          Iniciar sesión
        </a>
        <a tabindex="0" [routerLink]="'/register'" routerLinkActive="active">
          Registrarse
        </a>
        <h2>Aquí irá la barra de búsqueda</h2>
      </section>
    </main>
  `,
  styleUrl: './landing.component.css',
})
export default class LandingComponent {}
