import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements AfterViewInit {

  private map: any;

  private initMap(): void {
    // Coordenadas de Huejutla, Hidalgo
    const huejutla: L.LatLngExpression = [21.1381, -98.4187];

    // Inicializa el mapa
    this.map = L.map('map', {
      center: huejutla,
      zoom: 13, // Ajusta el nivel de zoom
    });

    // Cargar el mapa base (puedes cambiar el estilo de mapas aquí)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Marcador en Huejutla
    const marker = L.marker(huejutla)
      .addTo(this.map)
      .bindPopup('<b>Taller Automotriz Heber</b><br>Ubicado en Huejutla, Hidalgo.')
      .openPopup();
  }

  // Después de que la vista se haya cargado completamente
  ngAfterViewInit(): void {
    this.initMap();
  }
}
