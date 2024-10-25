import { Component, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ContactInfo {
  _id: string;
  direccion: string;
  correo: string;
  telefono: string;
}

interface TitleInfo {
  _id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SloganInfo {
  _id: string;
  slogan: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SocialNetwork {
  _id: string; // Identificador de la red social
  type: string; // Nombre de la red social
  url: string; // Enlace a la red social
}

@Component({
  selector: 'app-admin-page',
  standalone: true,
  templateUrl: './admin-page.component.html',
  imports: [FormsModule, CommonModule],
})
export class AdminPageComponent {
  contactInfo: WritableSignal<ContactInfo> = signal({ direccion: '', correo: '', telefono: '', _id: '' });
  socialLinks: WritableSignal<SocialNetwork[]> = signal([]);
  pageTitle: WritableSignal<{ _id: string, titulo: string }> = signal({ _id: '', titulo: '' });
  pageSlogan: WritableSignal<{ _id: string, eslogan: string }> = signal({ _id: '', eslogan: '' });

  constructor(private http: HttpClient) {
    this.loadContactInfo();
    this.loadPageTitle();
    this.loadPageSlogan();
    this.loadSocialLinks();
  }

  trackByFn(index: number, item: any): string {
    return item && item._id ? item._id : ''; // Devuelve una cadena vacía si item es nulo o no tiene _id
}

  
//____________________________________________________________________________________________________________________________________________________________________________________

  loadContactInfo() {
    this.http.get<ContactInfo>('https://taller-backend-two.vercel.app/contactdata/recent').subscribe({
      next: (data) => {
        if (data && data._id) {
          this.contactInfo.set(data);
        } else {
          console.error('No se encontró el ID en los datos de contacto');
        }
      },
      error: (err) => console.error('Error al cargar datos de contacto', err),
    });
  }

  updateContactInfo() {
    const contactId = this.contactInfo()._id;
    if (!contactId) {
      console.error('El ID del contacto es undefined');
      return;
    }

    this.http.put(`https://taller-backend-two.vercel.app/contactdata/update-contactdata/${contactId}`, this.contactInfo()).subscribe({
      next: () => alert('Datos de contacto actualizados correctamente'),
      error: (err) => alert('Error al actualizar datos de contacto'),
    });
  }

//____________________________________________________________________________________________________________________________________________________________________
  
  loadSocialLinks() {
    const platforms = ['Facebook', 'Twitter', 'Instagram'];
    platforms.forEach(platform => this.loadSocialLink(platform));
  }
  
  loadSocialLink(platform: string) {
    this.http.get<SocialNetwork>(`https://taller-backend-two.vercel.app/socialnetworks/most-recent/${platform}`).subscribe({
      next: (data) => {
        const existingLinks = this.socialLinks();
        const index = existingLinks.findIndex(link => link.type === platform);
        
        if (index !== -1) {
          // Actualiza el enlace existente
          existingLinks[index].url = data.url;
        } else {
          // Agrega un nuevo enlace
          existingLinks.push(data);
        }
        this.socialLinks.set(existingLinks); // Establece los datos de las redes sociales
      },
      error: (err) => console.error(`Error al cargar las redes sociales de ${platform}:`, err),
    });
  }
  
  updateSocialLink(link: SocialNetwork) {
    this.http.put(`https://taller-backend-two.vercel.app/socialnetworks/update-social/${link._id}`, { type: link.type, url: link.url }).subscribe({
        next: () => alert(`${link.type} actualizado correctamente`),
        error: (err) => console.error(`Error al actualizar ${link.type}:`, err),
    });
}

//____________________________________________________________________________________________________________________________________________________________________________________

  loadPageTitle() {
    this.http.get<TitleInfo>('https://taller-backend-two.vercel.app/titlepage/recent').subscribe({
      next: (data) => {
        if (data && data._id) {
          console.log('Título cargado:', data);
          this.pageTitle.set({
            _id: data._id,
            titulo: data.title
          });
        } else {
          console.error('No se encontró el ID en los datos del título');
        }
      },
      error: (err) => console.error('Error al cargar el título de la página:', err),
    });
  }

  updatePageTitle() {
    const titleId = this.pageTitle()._id;
    if (!titleId) {
      console.error('El ID del título es undefined');
      return;
    }

    const updatedTitle = { title: this.pageTitle().titulo };

    this.http.put(`https://taller-backend-two.vercel.app/titlepage/update-title/${titleId}`, updatedTitle).subscribe({
      next: () => {
        console.log('Título actualizado exitosamente');
        alert('Título de la página actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar el título:', err);
        alert('Error al actualizar el título de la página');
      }
    });
  }
//____________________________________________________________________________________________________________________________________________________________________________________

  loadPageSlogan() {
    this.http.get<SloganInfo>('https://taller-backend-two.vercel.app/slogan/recent').subscribe({
      next: (data) => {
        if (data && data._id) {
          console.log('Eslogan cargado:', data);
          this.pageSlogan.set({
            _id: data._id,
            eslogan: data.slogan
          });
        } else {
          console.error('No se encontró el ID en los datos del eslogan');
        }
      },
      error: (err) => console.error('Error al cargar el eslogan de la página:', err),
    });
  }

  updatePageSlogan() {
    const sloganId = this.pageSlogan()._id;
    if (!sloganId) {
      console.error('El ID del eslogan es undefined');
      return;
    }

    const updatedSlogan = { slogan: this.pageSlogan().eslogan };

    this.http.put(`https://taller-backend-two.vercel.app/slogan/update-slogan/${sloganId}`, updatedSlogan).subscribe({
      next: () => {
        console.log('Eslogan actualizado exitosamente');
        alert('Eslogan de la página actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar el eslogan:', err);
        alert('Error al actualizar el eslogan de la página');
      }
    });
  }
}
