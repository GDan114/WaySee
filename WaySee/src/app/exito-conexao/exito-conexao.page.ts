import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Haptics } from '@capacitor/haptics';

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
  //para o audio
  private audioAtual: HTMLAudioElement | null = null;

  async reproduzirAudio(cor: string) {
    try {
      // Interrompe um áudio anterior, se existir
      if (this.audioAtual) {
        this.audioAtual.pause();
        this.audioAtual.currentTime = 0;
      }

      let arquivo = '';

      if (cor === 'vermelho') {
        arquivo = 'assets/audio/pare.mp3';
      } else if (cor === 'verde') {
        arquivo = 'assets/audio/prossiga.mp3';
      } else {
        return;
      }

      this.audioAtual = new Audio(arquivo);

      await this.audioAtual.play();

    } catch (erro) {
      console.error('Erro ao reproduzir áudio:', erro);
    }
  }

  // Vibração para cada caso
  async vibrarSemaforo() {
    try {
      if (this.corAtual === 'vermelho') {
        // Uma vibração longa: sinal vermelho
        await Haptics.vibrate({
          duration: 2000
        });
      } else if (this.corAtual === 'verde') {
        // Duas vibrações curtas: sinal verde
        await Haptics.vibrate({
          duration: 600
        });
        // Intervalo entre as vibrações
        await new Promise(resolve => setTimeout(resolve, 400));
        await Haptics.vibrate({
          duration: 600
        });
      }
    } catch (erro) {
      console.error('Erro ao executar vibração:', erro);
    }
  }
  
  // Variável que controla a tela (agora apenas 'vermelho' ou 'verde')
  corAtual: string = ''; 

  constructor(private route: ActivatedRoute) {
    // Mantemos os ícones necessários para o cabeçalho e botão Home
    addIcons({ home, locationOutline });
  }

  ngOnInit() {
  this.route.queryParams.subscribe(async params => {
    if (params['cor']) {
      const novaCor = params['cor'].toLowerCase();
      // Evita vibrar novamente se a cor não mudou
      if (this.corAtual !== novaCor) {
        this.corAtual = novaCor;
        console.log(
          'A cor recebida do semáforo de pedestres foi:',
          this.corAtual
        );
        await this.vibrarSemaforo();

        await this.reproduzirAudio(this.corAtual);
      }
    }
  });
}

}