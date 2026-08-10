import { Component, OnInit, AfterViewInit} from '@angular/core';
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

export class RotaGpsPage implements AfterViewInit {
  endereco: string = '';
  map!:L.Map;


  pontos = [
    {
      nome:'Semáforo',
      lat:-23.963702, 
      lng:-46.321562,
      raio:10,
      notificado:false
    },

    {
      nome:'Biblioteca',
      lat:-23.963985, 
      lng:-46.321562,
      raio:10,
      notificado:false
    }
  ];

  constructor() { }

  async ngAfterViewInit() {
    this.criarMapa();
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
    await this.mostrarLocalizacao();
  }
  // FUNÇÃO DA ROTA
  async abrirRota() {
    if (!this.endereco) return;

    const destino = encodeURIComponent(this.endereco);

    try {
      const pos = await Geolocation.getCurrentPosition();

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&origin=${lat},${lng}` +
        `&destination=${destino}` +
        `&travelmode=walking` +
        `&dir_action=navigate`;

      window.open(url, '_system');

    } catch (err) {
      console.log('Erro ao pegar localização', err);

      // fallback (caso usuário negue permissão)
      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${destino}` +
        `&travelmode=walking` +
        `&dir_action=navigate`;
      window.open(url, '_system');
    }
  }
  // FUNÇÃO DO MAPA
  criarMapa(){

    this.map=L.map('map').setView(
    [-23.963702, -46.321562],
    18
    );

    L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ).addTo(this.map);

    this.pontos.forEach(p=>{

    L.marker([p.lat,p.lng])
    .addTo(this.map)
    .bindPopup(p.nome);

    L.circle([p.lat,p.lng],{

    radius:p.raio,
    color:'blue'

    }).addTo(this.map);

    });
  }
  // FUNÇÃO PARA MOSTRAR LOCALIZAÇÃO NO MAPA
  async mostrarLocalizacao() {
    try {
      const pos = await Geolocation.getCurrentPosition();

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup("Você")
        .openPopup();

      this.map.setView([lat, lng], 18);

      // ADICIONE ESTA LINHA
      this.verificarPontos(lat, lng);

    } catch (e) {
      console.log(e);
    }
  }
  // FUNÇÃO PARA CALCULAR DISTÂNCIA
  calcularDistancia(
      lat1:number,
      lon1:number,
      lat2:number,
      lon2:number
    ){

    const R=6371000;

    const dLat=(lat2-lat1)*Math.PI/180;
    const dLon=(lon2-lon1)*Math.PI/180;

    const a=
    Math.sin(dLat/2)**2+
    Math.cos(lat1*Math.PI/180)*
    Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)**2;

    const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

    return R*c;
  }

  //FUNÇÃO PARA VERIFICAR OS PONTOS PERSONALIZADOS
  verificarPontos(lat:number,lng:number){
    this.pontos.forEach(p=>{
      const distancia=this.calcularDistancia(
        lat,
        lng,
        p.lat,
        p.lng
      );

      if(distancia<p.raio && !p.notificado){
        alert("Você chegou em "+p.nome);
        p.notificado=true;
      }

      if(distancia>p.raio){
        p.notificado=false;
      }
    });

  }
}
