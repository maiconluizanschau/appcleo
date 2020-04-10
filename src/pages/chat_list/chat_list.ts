import { timer } from 'rxjs/observable/timer';
import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { HomePage } from './../home/home';
import { Chatsecret } from './../../models/chatsecret.model';
import { Component } from '@angular/core';

import { MenuController, NavController } from 'ionic-angular';

import { FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';

import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.models';

import { ChatPage } from './../chat/chat';

import { ChatService } from './../../providers/chat/chat';
import { AuthService } from './../../providers/auth/auth';
import { UserService } from './../../providers/user/user';

import * as firebase from 'firebase/app';
import { ChatSecretoPage } from '../chat-secreto/chat-secreto';
import { MatchService } from '../../providers/match/match';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ChatSecretService } from '../../providers/chatsecret/chatsecret';
import { ConfiguracaoService } from '../../providers/configuracao/configuracao';
import { Config } from '../../models/config.model';
import { Flert } from '../../models/flert.model';
import { Groups } from '../../models/groups.model';
import { Membros } from '../../models/membros.models';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
@Component({
    selector: 'page-chat_list',
    templateUrl: 'chat_list.html'
})
export class ChatListPage {

    usersSecrets: FirebaseListObservable<User[]>;
    view: string = 'flerts';
    Chatsecret: boolean = false;
    mostrar: boolean;
    chats: FirebaseListObservable<Chat[]>;
    chatsAmizade: FirebaseListObservable<Chat[]>;
    chatSecret: FirebaseListObservable<Chatsecret[]>;
    groups: FirebaseListObservable<Membros[]>;
    user: FirebaseObjectObservable<User>;
    users: FirebaseListObservable<User[]>;
    membros: FirebaseListObservable<Membros[]>;
    userList = [];
    meusFlerts = [];
    meusChatsSecrets = [];
    meusGrupos = [];
    //meusGruposKey = [];
    constructor(
        public authService: AuthService,
        public chatService: ChatService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public userService: UserService,
        public flertService: MatchService,
        public groupsService: GroupsConfiguracaoService,
        public db: AngularFireDatabase,
        public alertCtrl: AlertController,
        public chatSecretService: ChatSecretService,
        public configService: ConfiguracaoService,
        public matchService: MatchService,
        private toastCtrl: ToastController
    ) {


    }

    //ANTES DAS PAGINAS CARREGAR VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        //this.meusGrupos = this.groupsService.meusGrupos(this.authService.getUid())
        return this.authService.authenticated;    
    }

    ionViewWillEnter() {
        //this.userList = this.matchservice.buscaMeusFlert();//antigo
        this.userList = this.matchService.meusFlerts(this.authService.getUid());
       // this.userListEsconder = this.esconderPerfil();
    }

    //PERMITIR A VISUALIZAÇÃO DO PERFIL
    private abrirPerfil(user: any) {
        this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja abrir seu perfil para ' + user.name,
            buttons: [

                {
                    text: 'NÃO',
                    handler: () => {
                        this.flertService.viewPerfil(user, this.authService.getUid(), false);
                    }
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.flertService.viewPerfil(user, this.authService.getUid(), true);
                    }
                },
                {
                    text: 'CANCELAR',
                }
            ]
        }).present();

    }

    //PAGIANA ESTA CARREGADA 
    ionViewDidLoad() {
        this.chats = this.chatService.chats; //amizade
        //this.users = this.userService.users; // usuarios
        this.chatSecret = this.chatSecretService.chatsecret;
        this.groups = this.groupsService.groupsKey;
        let id = this.authService.getUid();
        this.meusChatsSecrets = [];
        this.meusChatsSecrets = this.flertService.secrets();
        this.meusFlerts = [];
        this.meusFlerts = this.flertService.meusFlerts(id);
        this.meusGrupos = [];
        this.meusGrupos = this.groupsService.meusGrupos(id);
        this.menuCtrl.enable(true, 'user-menu');
    }

    //FAZER PESQUISA DO USER
    filterItems(event: any): void {
        let searchTerm: string = event.target.value;
        if (searchTerm) {
            switch (this.view) {
                case 'secrets':
                    this.meusChatsSecrets = this.meusChatsSecrets
                        .filter(
                            (user: User) => (
                                user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                            ));
                    break;
                case 'flerts':
                    this.meusFlerts = this.meusFlerts.find(
                        (user: User) => (
                            user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                        ));
                    break;
            }
        } else {
            this.meusChatsSecrets = [];
            this.meusChatsSecrets = this.flertService.secrets();
            this.meusFlerts = [];
            this.meusFlerts = this.flertService.meusFlerts(this.authService.getUid());
        }
    }

    //CRIAÇAÕ DO CHAT ENTRE USUARIOS 
    onChatCreate(recipientUser: Chat): void {
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((currentUser: User) => {
                this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)  // caminho /users/id1/id2
                    .first()
                    .subscribe((chat: Chat) => {
                        //o objeto chat tem um propriedade(chat)valida?
                        if (chat.hasOwnProperty('$value')) {
                            let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                            let chat1 = new Chat('', timestamp, recipientUser.title, (recipientUser.photo || ''));
                            this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
                            let chat2 = new Chat('', timestamp, currentUser.name, (currentUser.photo || ''));
                            this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
                            
                        }
                    });
            });
        this.navCtrl.push(ChatPage, {
            recipientUser: recipientUser, grupoAtivar: false
        });
    }

    //CRIAÇAÕ DO CHAT GRUPO
    onChatGroupCreate(grupo: Groups): void {
        this.navCtrl.push(ChatPage, {
            recipientGroup: grupo, grupoAtivar: true 
        });
    }

    //CRIAÇÃO DO CHAT ENTRE USUARIOS TEMPORÁRIO 48 HORAS
    private openChaSecret(recipientUser: Chatsecret): void {
        let timeAtual = new Date();
        let minhaKey = this.authService.getUid();
        let diferenca;
        this.matchService.getDeepChatsecret(minhaKey, recipientUser.$key)  // caminho /users/id1/id2
            .subscribe((chat: Chatsecret) => {   
                //console.log("Entrou no chat de relacionamento. "+recipientUser.title);
                let timeBanco = new Date(chat.inicioChat);
                timeBanco.setTime(timeBanco.getTime() + 86400000);
                //console.log("BANCO MAIS 1: "+timeBanco.getTime()); 
                //console.log("BANCO MAIS 1: "+timeBanco);
                /*
                é pego a data do banco que vem em milsegundos add um dia a mais (86400000s) 
                calculado a diferença se a diferença for maior e positiva  user deve ser removido caso for menos
                e negativa mostrar
                */
                diferenca = timeBanco.getTime() - timeAtual.getTime();
                //console.log("DIFERENCA: "+diferenca*-1);

            });
            if (diferenca* -1 >= 86400000 && recipientUser.passou48h === 'false') {
                //console.log("PASSOU DAS 24h a remover_> ");
                this.doConfirm(minhaKey, recipientUser)
            }
            else if(diferenca* -1 < 86400000 || recipientUser.passou48h === 'true') {
                
                this.navCtrl.push(ChatSecretoPage, {
                    recipientUser: recipientUser
                });
            }
    }

   //MENSAGEM QUE TEMPO JA SE ESGOTOU 24h
   private doConfirm(minhaKey: string, userChat: Chatsecret) {
    const alert = this.alertCtrl.create({
        title: 'Vocẽ deseja continuar a conversar?',
        message: 'O Chat Secreto com '+ userChat.title+' já esgotou. ',
        buttons: [
            {
                text: 'DESLIKE',
                handler: () => {
                    console.log('Não');
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    let user1 = new Flert(userChat.$key, timestamp, userChat.title, (userChat.photo || ''));
                    this.chatSecretService.votoSecret(false, userChat.$key, minhaKey)
                    firebase.database().ref("chatsecret/" + minhaKey + "/" + userChat.$key).remove();
                    firebase.database().ref("chatsecret/" + userChat.$key + "/" + minhaKey).remove();
                    firebase.database().ref("messagesecret/" + minhaKey + "-" + userChat.$key).remove();
                    firebase.database().ref("messagesecret/" + userChat.$key + "-" + minhaKey).remove();
                    //this.meusChatsSecrets.splice(index, 1);
                    this.meusFlerts = [];
                }
            },
            {
                text: 'LIKE',
                handler: () => {
                    console.log('SIM');
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    let user1 = new Flert(userChat.$key, timestamp, userChat.title, (userChat.photo || ''));
                    this.chatSecretService.alterarStatusConversaRelacionamento(userChat.$key, minhaKey, 'true');
                }
            }
        ]
    });

    alert.present();
}

    //DEFAZER FLEART DEL OBSERBLE
    private desfazerFlert(index, user: Chat) {
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
                    }
                }
            ]
        });
        alert.present();
    }

}