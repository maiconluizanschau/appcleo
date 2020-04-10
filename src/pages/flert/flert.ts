import { AvaliacaoProvider } from './../../providers/avaliacao/avaliacao';
import { Voto } from './../../models/voto.model';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { LottieAnimationViewModule } from 'ng-lottie';
import { ConfigPage } from './../config/config';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component, Input } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.models';

import { UserService } from './../../providers/user/user';
import { MatchService } from './../../providers/match/match';
import { ChatService } from './../../providers/chat/chat';
import { AuthService } from "../../providers/auth/auth";
import { ChatListPage } from "../chat_list/chat_list";
import { ChatPage } from './../chat/chat';
import * as firebase from 'firebase/app';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { AvaliacaoPage } from '../avaliacao/avaliacao';

@Component({
    selector: 'page-flert',
    templateUrl: 'flert.html'
})
export class FlertPage {

    public pontuacaoMediaBeleza : number = 0;
    public pontuacaoMediaConversa : number = 0;
    public pontuacaoMediaSimpatia : number = 0;
    public pontuacaoTotalBeleza : number = 0;
    public pontuacaoTotalConversa : number = 0;
    public pontuacaoTotalSimpatia : number = 0;
    public nroAvaliacoes: number = 0;
    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public matchservice: MatchService,
        public alertCtrl: AlertController,
        public userService: UserService,
        public chatService: ChatService,
        public db: AngularFireDatabase,
        private toastCtrl: ToastController,
        public aval: AvaliacaoProvider
    ) {}

    ionViewWillEnter() {
        this.authService.getUid();
        this.calculoAvaliacao();
        
    }

    //VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    public calculoAvaliacao(){
        this.aval.buscaAvaliacao()
        .subscribe(avaliacao => {
            avaliacao.forEach(avaliacao => {
                    this.nroAvaliacoes = this.nroAvaliacoes + 1;
                    this.pontuacaoTotalBeleza = (this.pontuacaoTotalBeleza + avaliacao.beleza);
                    this.pontuacaoTotalConversa = (this.pontuacaoTotalConversa + avaliacao.conversa);
                    this.pontuacaoTotalSimpatia = (this.pontuacaoTotalSimpatia + avaliacao.simpatia);
                    this.pontuacaoMediaSimpatia = (this.pontuacaoTotalSimpatia/this.nroAvaliacoes);
                    this.pontuacaoMediaBeleza = (this.pontuacaoTotalBeleza/this.nroAvaliacoes);
                    this.pontuacaoMediaConversa = (this.pontuacaoTotalConversa/this.nroAvaliacoes);
                })
            });
        //this.pontuacaoMediaSimpatia = (this.pontuacaoMediaSimpatia/this.nroAvaliacoes);
        
    }
    //IR PAGINA CONFIGURAÇÕES
    onConfig(): void {
        this.navCtrl.push(ConfigPage);
    }

    //IR PAGINA DO CHAT
    private chat(): void {
        this.navCtrl.push(ChatListPage);
    }

    //AVALIAR USER
    private avaliar(user: User) {
        this.navCtrl.push(AvaliacaoPage, {
            user: user
        });
    }



}
