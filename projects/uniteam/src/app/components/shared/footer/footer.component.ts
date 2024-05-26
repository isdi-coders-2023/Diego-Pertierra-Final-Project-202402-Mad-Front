import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'isdi-footer',
  standalone: true,
  imports: [RouterModule],
  template: `
    <footer>
      <section>
        <h2>Tu cuenta</h2>
        <h3>Mensajes</h3>
        <a href="#" [routerLink]="'/login'"><h3>Cerrar sesión</h3></a>
      </section>
      <hr />
      <section>
        <h2>Descubre</h2>
        <h3>Eventos</h3>
        <h3>Grupos</h3>
      </section>
      <hr />
      <section>
        <h2>Sobre uniteam</h2>
        <h3>Contacto</h3>
        <h3>Manual de identidad</h3>
      </section>
      <section class="socials-section">
        <p>&copy;2024 Copyright: Uniteam - Todos los derechos reservados</p>
        <div class="socials">
          <a href="https://www.facebook.com/" target="_blank">
            <img
              src="assets/img/socials/facebook.svg"
              alt="Icono de Facebook"
              width="30"
            />
          </a>
          <a href="https://twitter.com/" target="_blank">
            <img
              src="assets/img/socials/x.svg"
              alt="Icono de Twitter"
              width="30"
            />
          </a>
          <a href="https://www.instagram.com/" target="_blank">
            <img
              src="assets/img/socials/instagram.svg"
              alt="Icono de Instagram"
              width="30"
            />
          </a>
          <a href="https://www.youtube.com/" target="_blank">
            <img
              src="assets/img/socials/youtube.svg"
              alt="Icono de Youtube"
              width="30"
            />
          </a>
        </div>
      </section>
    </footer>
  `,
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
