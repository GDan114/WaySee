import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-conexao-semaforo',
  templateUrl: './conexao-semaforo.page.html',
  styleUrls: ['./conexao-semaforo.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, RouterModule]
})
export class ConexaoSemaforoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
