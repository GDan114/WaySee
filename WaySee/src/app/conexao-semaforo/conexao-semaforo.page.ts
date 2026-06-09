import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conexao-semaforo',
  templateUrl: './conexao-semaforo.page.html',
  styleUrls: ['./conexao-semaforo.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ConexaoSemaforoPage implements OnInit {

  private urlDoEsp = 'http://192.168.4.1/status'; 

  constructor(
    private router: Router, 
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.tentarConectarSemaforo();
  }

  tentarConectarSemaforo() {
    console.log('Buscando semáforo na rede...');

    // Lê diretamente o JSON enviado pelo ESP32 usando <any>
    this.http.get<any>(this.urlDoEsp).subscribe({
      next: (resposta) => {
        // Verifica se o JSON tem o status "conectado" que o ESP32 enviou
        if (resposta.status === 'conectado') {
          console.log('Semáforo encontrado! Cor enviada:', resposta.cor);
          
          // Vai para a tela de êxito levando a cor como "bagagem" (query param)
          this.router.navigate(['/exito-conexao'], { 
            queryParams: { cor: resposta.cor } 
          }); 
        }
      },
      error: (erro) => {
        console.error('Semáforo não encontrado. Erro:', erro);
        this.router.navigate(['/erro-conexao']); 
      }
    });
  }
}