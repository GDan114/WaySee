import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

// Importações necessárias para o ícone funcionar no modo Standalone
import { addIcons } from 'ionicons';
import { homeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-erro-conexao',
  templateUrl: './erro-conexao.page.html',
  styleUrls: ['./erro-conexao.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ErroConexaoPage implements OnInit {

  constructor() {
    // Registra o ícone da casinha para poder ser usado no HTML
    addIcons({ homeOutline });
  }

  ngOnInit() {
  }

}