import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
import { home, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-exito-conexao',
  templateUrl: './exito-conexao.page.html',
  styleUrls: ['./exito-conexao.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ExitoConexaoPage implements OnInit {
  
  // Variável que controla a tela (agora apenas 'vermelho' ou 'verde')
  corAtual: string = 'vermelho'; 

  constructor(private route: ActivatedRoute) {
    // Mantemos os ícones necessários para o cabeçalho e botão Home
    addIcons({ home, locationOutline });
  }

  ngOnInit() {
    // Lê o parâmetro 'cor' que veio da tela de carregamento
    this.route.queryParams.subscribe(params => {
      if (params['cor']) {
        this.corAtual = params['cor'];
        console.log('A cor recebida do semáforo de pedestres foi:', this.corAtual);
      }
    });
  }

}