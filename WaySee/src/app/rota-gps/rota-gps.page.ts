import { Component, AfterViewInit, OnDestroy } from '@angular/core'; // To mundando aqui
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { LocalNotifications } from '@capacitor/local-notifications';
import * as L from 'leaflet';
// semáforo em tempo real
import { HttpClient } from '@angular/common/http';
import { timer, EMPTY, Subscription } from 'rxjs';
import { exhaustMap, catchError } from 'rxjs/operators';

// npx cap sync
// npx cap open android

@Component({
  selector: 'app-rota-gps',
  templateUrl: './rota-gps.page.html',
  styleUrls: ['./rota-gps.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,  IonInput, IonItem, IonList, RouterModule, FormsModule],
})

export class RotaGpsPage implements AfterViewInit {
  // implementação do semáforo em tempo real
    // Comunicação com o ESP32
  private urlDoEsp = 'http://192.168.4.1/status';

  // Controle do monitoramento
  private monitoramentoSemaforo?: Subscription;

  // Guarda a última cor recebida
  private corAtual: string = '';

  // Controle do áudio
  private audioAtual: HTMLAudioElement | null = null;

  // ID fixo para atualizar a mesma notificação
  private idNotificacao = 1001;

  // fim

  endereco: string = '';
  map!:L.Map;
  // Identificador do acompanhamento GPS
  watchId: string | null = null;

  // Marcador da localização do usuário
  marcadorUsuario!: L.Marker;

  // Controla a primeira localização
  primeiraLocalizacao: boolean = true;

  pontos = [
    {
      nome:'Semáforo Teste',
      lat:-23.963702, 
      lng:-46.321562,
      raio:100,
      notificado:false
    },
    {
      nome:'Semáforo Maquete',
      lat:-23.930465,  
      lng:-46.346641,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.932338,  
      lng:-46.337571,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo-CasaDanilo',
      lat:-23.95452196387473,  
      lng:-46.40357420933549,
      raio:50,
      notificado:false
    },
    {
      nome:'Semáforo', 
      lat:-23.934307,  
      lng:-46.330271,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.934348,  
      lng:-46.335371,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.942476,  
      lng:-46.334746,
      raio:10,
      notificado:false
    },
    {
      nome:'Semáforo',
      lat:-23.944593,  
      lng:-46.325222,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.950806,  
      lng:-46.323995,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.954689,  
      lng:-46.322798,
      raio:10,
      notificado:false
    },  
    {
      nome:'Semáforo',
      lat:-23.957903,  
      lng:-46.321635,
      raio:10,
      notificado:false
    }, 
    {
      nome:'Semáforo',
      lat:-23.937604,  
      lng:-46.324689,
      raio:10,
      notificado:false
    }
  ];
  // Funções conexão do semáforo

  async reproduzirAudio(cor: string) {
    try {

      // Interrompe o áudio anterior
      if (this.audioAtual) {
        this.audioAtual.pause();
        this.audioAtual.currentTime = 0;
      }

      let arquivo = '';

      if (cor === 'vermelho') {
        arquivo = 'assets/audio/pare.mp3';
      } 
      else if (cor === 'verde') {
        arquivo = 'assets/audio/prossiga.mp3';
      }

      if (!arquivo) return;

      this.audioAtual = new Audio(arquivo);

      await this.audioAtual.play();

    } catch (erro) {
      console.error('Erro ao reproduzir áudio:', erro);
    }
  }

  async vibrarSemaforo() {
  try {

    if (this.corAtual === 'vermelho') {

      await Haptics.vibrate({
        duration: 2000
      });

    } 
    else if (this.corAtual === 'verde') {

      await Haptics.vibrate({
        duration: 600
      });

      await new Promise(resolve => setTimeout(resolve, 400));

      await Haptics.vibrate({
        duration: 600
      });

    }

  } catch (erro) {
    console.error('Erro ao vibrar:', erro);
  }
}

async notificarEstadoSemaforo(cor: string) {

  let mensagem = '';

  if (cor === 'vermelho') {
    mensagem = 'Sinal vermelho para pedestres. Pare!';
  } 
  else if (cor === 'verde') {
    mensagem = 'Sinal verde para pedestres. Prossiga!';
  }

  try {

    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'WaySee - Estado do semáforo 🚦',
          body: mensagem,
          id: this.idNotificacao,
          channelId: 'waysee-alertas3',
          schedule: {
            at: new Date(Date.now() + 500)
          },
          foreground: true,
          silent: true
        }
      ]
    });

  } catch (erro) {
    console.error('Erro ao atualizar notificação:', erro);
  }

}

  iniciarMonitoramentoSemaforo() {
    // Consulta imediatamente e depois a cada 1 segundo
    this.monitoramentoSemaforo = timer(0, 1000).pipe(

      exhaustMap(() =>
        this.http.get<any>(this.urlDoEsp).pipe(

          catchError(erro => {
            console.log('Erro ao consultar semáforo:', erro);
            return EMPTY;
          })

        )
      )

    ).subscribe(resposta => {

      if (resposta.status !== 'conectado') {
        return;
      }

      const novaCor = resposta.cor?.toLowerCase();

      // Aceita somente vermelho e verde
      if (novaCor !== 'vermelho' && novaCor !== 'verde') {
        return;
      }

      // Evita repetir alertas quando a cor não mudou
      if (this.corAtual === novaCor) {
        return;
      }

      this.corAtual = novaCor;

      console.log('Estado atualizado:', this.corAtual);

      // Executa os recursos de acessibilidade
      this.vibrarSemaforo();
      this.reproduzirAudio(this.corAtual);

      // Atualiza a notificação
      this.notificarEstadoSemaforo(this.corAtual);
    });
  }

  // Fim
  constructor(private http: HttpClient) { }
  // Solicita permissão para notificações locais
  async solicitarPermissaoNotificacao() {
    const permissao = await LocalNotifications.requestPermissions();
    if (permissao.display === 'granted') {
      console.log('Permissão de notificação concedida!');
    } else {
      console.log('Permissão de notificação negada.');
    }
  }

  async ngAfterViewInit() {
    this.criarMapa();

    await this.solicitarPermissaoNotificacao();
    await this.criarCanalNotificacao();

    // Começa a monitorar o estado do semáforo
    this.iniciarMonitoramentoSemaforo();

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);

    // Mantém o acompanhamento GPS
    await this.iniciarAcompanhamento();
  }

  ngOnDestroy() {
  if (this.watchId !== null) {
    Geolocation.clearWatch({
      id: this.watchId
    });
    this.watchId = null;
  }
  if (this.map) {
    this.map.remove();
  }
}

async criarCanalNotificacao() {
  await LocalNotifications.createChannel({
    id: 'waysee-alertas3',
    name: 'Alertas de semáforos',
    description: 'Notificações de aproximação de semáforos',
    importance: 5,
    sound: 'semaforo',
    vibration: true
  });

}

// Mostrar noticação de semáforo próximo
async notificarSemaforo(nome: string) {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Atenção! 🚦',
          body: `Há um semáforo próximo!`,
          id: Math.floor(Date.now() % 2147483647),
          channelId: 'waysee-alertas3',
          schedule: {
            at: new Date(Date.now() + 500)
          },
          foreground: true
        }
      ]
    });
  } catch (e) {
    console.log('Erro ao enviar notificação:', e);
  }
}

  async iniciarAcompanhamento() {
    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        },
        (pos, err) => {
          if (err) {
            console.log('Erro ao acompanhar localização:', err);
            return;
          }
          if (!pos) return;
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          console.log('Latitude:', lat);
          console.log('Longitude:', lng);
          // Atualiza marcador no mapa
          if (!this.marcadorUsuario) {
            const iconeVoce = L.icon({
              iconUrl: 'assets/icon/pin-icon.png',
              iconSize: [40, 40],
              iconAnchor: [20, 40],
              popupAnchor: [0, -40]
            });
            this.marcadorUsuario = L.marker([lat, lng], {
              icon: iconeVoce
            })
              .addTo(this.map)
              .bindPopup("Você");
          } else {
            this.marcadorUsuario.setLatLng([lat, lng]);
          }
          // Centraliza o mapa apenas na primeira localização
          if (this.primeiraLocalizacao) {
            this.map.setView([lat, lng], 18);
            this.primeiraLocalizacao = false;
          }
          // Verifica proximidade dos semáforos
          this.verificarPontos(lat, lng);
        }
      );
    } catch (e) {
      console.log('Não foi possível iniciar o GPS:', e);
    }
  }

  /*// função de vibrar
 async vibrar() {
    try {
      await Haptics.vibrate({
        duration: 1500
      });
    } catch (e) {
      console.log('Erro ao vibrar:', e);
    }
  }*/

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
    const iconeSemaforo = L.icon({
      iconUrl: 'assets/icon/maps-semaforo-icon1.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
    this.pontos.forEach(p=>{
    L.marker([p.lat,p.lng], {
      icon: iconeSemaforo
    })
    .addTo(this.map)
    .bindPopup(p.nome);
    L.circle([p.lat,p.lng],{
    radius:p.raio,
    color:'green'
    }).addTo(this.map);
    });
  }
  // FUNÇÃO PARA MOSTRAR LOCALIZAÇÃO NO MAPA
  async mostrarLocalizacao() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const iconeVoce = L.icon({
      iconUrl: 'assets/icon/pin-icon.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
      L.marker([lat, lng], {
        icon: iconeVoce
      })
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
    verificarPontos(lat: number, lng: number) {
    this.pontos.forEach(p => {
      const distancia = this.calcularDistancia(
        lat,
        lng,
        p.lat,
        p.lng
      );
      if (distancia < p.raio && !p.notificado) {
        console.log('Semáforo próximo:', p.nome);
        // Marca como notificado antes de vibrar
        p.notificado = true;
        // alert("Semáforo próximo");
      }
      if (distancia > p.raio) {
        p.notificado = false;
      }
    });
  }
}
