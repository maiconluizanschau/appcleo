import { PerfilMatchPage } from './../../pages/perfil-match/perfil-match';
import { Groups } from './../../models/groups.model';
import { NewMatchComponent} from './../new-match/new-match.component';
import { HomePage } from './../../pages/home/home';
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
import { ChatListPage } from './../../pages/chat_list/chat_list';
import { AuthService } from './../../providers/auth/auth';
import { MatchService } from './../../providers/match/match';
import { UserService } from './../../providers/user/user';
import { Flert } from './../../models/flert.model';
import { ChatService } from './../../providers/chat/chat';
import { User } from './../../models/user.models';
import { ChatSecretoPage } from './../../pages/chat-secreto/chat-secreto';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { LottieAnimationViewModule } from 'ng-lottie';
//chat
import { Http } from '@angular/http';
import 'rxjs/Rx';
import * as firebase from 'firebase/app';

import { Config } from '../../models/config.model';
import { Chatsecret } from '../../models/chatsecret.model';


import { Component, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';

import { Direction, StackConfig, Stack, Card, ThrowEvent, DragEvent, SwingStackComponent, SwingCardComponent } from 'angular2-swing';

@Component({
  selector: 'flash-card',
  templateUrl: 'flash-card.component.html'
})
export class FlashCardComponent {

  @Input() user: User;//mensagem em si
  @Input() tipoConversa: string;
  @Input() grupo: Groups;
  @Input() acabou: boolean;
  @Input() acabouUserAmizade: boolean;
  @Input() acabouGrupo: boolean;

  idade: number;
  lottieConfig:any;
  constructor(
    public homePage: HomePage,
    public userService: UserService,
    public navCtrl: NavController
  ) {
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
        path: 'assets/whys.json',
        autoplay: true,
        loop: true
    }
  }

  // Conectado através do HTML
  new_match: boolean; //variavel para mostrar ou não a tela de novo match
  voteUp(like: boolean, user: User) {
    this.homePage.voteUp(like, user);
  }
  
  openChaSecret(like: boolean, user: User) {
    this.homePage.openChaSecret(like, user);
  }

  entrarGrupo(like: boolean, grupo: Groups){
    this.homePage.entrarGrupo(like, grupo);
  }

  swipeAtual(user: User) {
    this.voteUp(false, user);
  }

  //Abrir perfil do Match
  public abrirPerfilMatch(userMatch: User): void{
    this.navCtrl.push(PerfilMatchPage, {
        userMatch: userMatch, verPerfilHome: true
    });
  }
 
}
