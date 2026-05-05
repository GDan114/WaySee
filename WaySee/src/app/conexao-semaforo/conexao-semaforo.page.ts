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

    this.http.get(this.urlDoEsp, { observe: 'response' }).subscribe({
      next: (resposta) => {
        if (resposta.status === 200) {
          console.log('Semáforo encontrado e respondendo!');
          this.router.navigate(['/exito-conexao']); 
        }
      },
      error: (erro) => {
        console.error('Semáforo não encontrado. Erro:', erro);
        this.router.navigate(['/erro-conexao']); 
      }
    });
  }
}