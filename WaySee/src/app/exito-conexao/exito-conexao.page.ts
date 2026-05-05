import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute } from '@angular/router';

import { addIcons } from 'ionicons';
// Removido o arrowForwardOutline daqui
import { home, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'app-exito-conexao',
  templateUrl: './exito-conexao.page.html',
  styleUrls: ['./exito-conexao.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ExitoConexaoPage implements OnInit {
  
  corAtual: string = 'vermelho'; 

  constructor(private route: ActivatedRoute) {
    // Removido o arrowForwardOutline daqui também
    addIcons({ home, locationOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['cor']) {
        this.corAtual = params['cor'];
        console.log('A cor recebida do semáforo foi:', this.corAtual);
      }
    });
  }

}