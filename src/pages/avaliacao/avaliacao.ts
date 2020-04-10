import { PerfilMatchPage } from './../perfil-match/perfil-match';
import { FlertPage } from './../flert/flert';
import { AvaliacaoProvider } from './../../providers/avaliacao/avaliacao';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user.models';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
  selector: 'page-avaliacao',
  templateUrl: 'avaliacao.html',
})
export class AvaliacaoPage {

  conversa: any;
  beleza: any;
  simpatia: any;
  user: any;
  User: User;
  myId: string;
  comentario: string = '';

  constructor(
    private navCtrl: NavController, private navParams: NavParams,
    public afAuth: AngularFireAuth, public aval: AvaliacaoProvider,
    private toastCtrl: ToastController
  ) {
  }

  ionViewDidLoad() {
    this.user = this.navParams.get('user');
    this.User = this.navParams.get('user');
    console.log(this.user);
    this.afAuth.authState.subscribe((authUser: firebase.User) => {
      this.myId = authUser.uid;
    });
  }

  //**Voto  */
  private voto() {
    if (this.conversa) {
      if (this.beleza) {
        if (this.simpatia) {
          this.aval.createAvaliacao(this.myId, this.user.key, { beleza: this.beleza, simpatia: this.simpatia, conversa: this.conversa, comentario: this.comentario })
            .then(() => {
              this.presentToast('Avaliações enviadas com sucesso');
              this.navCtrl.pop();
            }).catch(() => {
              this.presentToast('Erro ao enviar as avaliações. Tente novamente.');
            });
        } else {
          this.presentToast('A simpatia não foi avaliada.');
        }
      } else {
        this.presentToast('A beleza não foi avaliada.');
      }
    } else {
      this.presentToast('A conversa não foi avaliada.');
    }
  }

  presentToast(msgm: string) {
    let toast = this.toastCtrl.create({
      message: msgm,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}


