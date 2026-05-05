import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';


@Component({
  selector: 'app-rota-gps',
  templateUrl: './rota-gps.page.html',
  styleUrls: ['./rota-gps.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,  IonInput, IonItem, IonList, RouterModule, FormsModule],
})

export class RotaGpsPage implements OnInit {
  endereco: string = '';

  constructor() { }

  ngOnInit() {
  }

  async abrirRota() {
  if (!this.endereco) return;

  const destino = encodeURIComponent(this.endereco);

  try {
    const pos = await Geolocation.getCurrentPosition();

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destino}`;

    window.open(url, '_system');

  } catch (err) {
    console.log('Erro ao pegar localização', err);

    // fallback (caso usuário negue permissão)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
    window.open(url, '_system');
  }
}
}
