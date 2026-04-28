import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-erro-conexao',
  templateUrl: './erro-conexao.page.html',
  styleUrls: ['./erro-conexao.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ErroConexaoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
