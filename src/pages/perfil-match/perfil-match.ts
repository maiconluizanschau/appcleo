import { AvaliacaoPage } from './../avaliacao/avaliacao';
import { ConversaConfiguracaoService } from './../../providers/conversaconfig/conversaconfig';
import { ConversaConfig } from './../../models/conversaconfig.model';
import { ChatListPage } from './../chat_list/chat_list';
import { UserService } from './../../providers/user/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AuthService } from './../../providers/auth/auth';
import { MatchService } from './../../providers/match/match';
import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.models';
import { Component } from '@angular/core';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-perfil-match',
  templateUrl: 'perfil-match.html',
})
export class PerfilMatchPage {

  userMatchChat: Chat;
  pageTitle: string; //titulo da pagina
  idadeUserMatchNumber: number;
  idadeUserMatchString: String;
  sobreUserMatch: String;
  photoUserMatch: String;
  localUserMatch: String;
  userList = [];
  UserMatch2: User;
  UserGostos: ConversaConfig;
  verPerfilHome: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public matchService: MatchService,
    public authService: AuthService,
    private toastCtrl: ToastController,
    public userService: UserService,
    public conversaService: ConversaConfiguracaoService
    ) {
  }

  ionViewDidLoad() {
    this.userMatchChat = this.navParams.get('userMatch');
    this.verPerfilHome = this.navParams.get('verPerfilHome');
    this.userService.getUser(this.userMatchChat.$key)
    .subscribe((user: User) => {
        this.UserMatch2 = user;
    });
    this.conversaService.buscaConversaConfigMatch(this.userMatchChat.$key)
    .subscribe((userAmizade: ConversaConfig) => {
        this.UserGostos = userAmizade;
    });
  }

    //DEFAZER FLEART DEL OBSERBLE
    private desfazerMatch(index, user: Chat) {
    const alert = this.alertCtrl.create({
        title: 'Confirmação',
        message: 'Você deseja desfazer o like?',
        buttons: [
            {
                text: 'NÃO',
            },
            {
                text: 'SIM',
                handler: () => {
                    this.matchService.remover(user.$key, this.authService.getUid());
                    this.userList.splice(index, 1);
                    this.userList = this.matchService.meusFlerts(this.authService.getUid());
                    this.toastCtrl.create({ message: 'Like desfeito </3', duration: 1000, position: 'top' }).present();
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }
            }
        ]
    });
    alert.present();
    }

    //AVALIAR USER
    private avaliar(user: User) {
        this.navCtrl.push(AvaliacaoPage, {
            user: user
        });
    }

}
