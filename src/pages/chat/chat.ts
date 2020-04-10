import { PerfilGrupoPage } from './../perfil-grupo/perfil-grupo';
import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { ChatGroupService } from './../../providers/chatGroup/chatGroup';
import { Membros } from './../../models/membros.models';
import { Groups } from './../../models/groups.model';
import { MessageGroup } from './../../models/messageGroup';
import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { AuthService } from './../../providers/auth/auth';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../providers/chat/chat';
import { Message } from './../../models/message.model';
import { MessageService } from './../../providers/message/message';
import { User } from './../../models/user.models';
import { UserService } from './../../providers/user/user';

import * as firebase from 'firebase/app';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { GroupedObservable } from 'rxjs/operator/groupBy';
import { PerfilMatchPage } from '../perfil-match/perfil-match';

@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {


    @ViewChild(Content) content: Content;
    messages: FirebaseListObservable<Message[]>;//lista d msgs
    messagesGroup: FirebaseListObservable<MessageGroup[]>;//lista d msgs
    pageTitle: string;//titulo da pagina 
    sender: User;//remetente
    recipient: User;//destinatario
    recipientChat: Chat; //destinatário do tipo chat
    recipientGroup: Groups; //destinatário do tipo groups
    ativarGrupo: boolean = false;
    mostrarMembrosView: boolean = false;
    membros: FirebaseListObservable<Membros[]>;//lista d membros grupo especifico
    private chat1: FirebaseObjectObservable<Chat>;
    private chat2: FirebaseObjectObservable<Chat>;
    private chatGroup1: FirebaseObjectObservable<Membros>;
    private chatGroup2: FirebaseObjectObservable<Membros>;
    constructor(
        public authService: AuthService,
        public chatService: ChatService,
        public chatGroupService: ChatGroupService,
        public messageService: MessageService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public userService: UserService,
        public groupsService: GroupsConfiguracaoService
    ) {
    }


    //VERIFICA SE ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;      
    }

    ionViewDidLoad() {

        //recebe parametros
        //console.log("Usuário do match: "+this.recipient.sobrenome);
        
        this.recipient = this.navParams.get('recipientUser');
        this.recipientChat = this.navParams.get('recipientUser');
        this.recipientGroup = this.navParams.get('recipientGroup');
        this.ativarGrupo = this.navParams.get('grupoAtivar');        

        if(!this.ativarGrupo){
            this.pageTitle = this.recipient.name;
            if(this.recipientChat.title){
                this.pageTitle = this.recipientChat.title;           
            }
        } 
        
        if(this.ativarGrupo){
            this.pageTitle = this.recipientGroup.name;
        }
        if(!this.ativarGrupo){
        //pegar remetente
        this.userService.currentUser
            .first()//somente primeiro valor
            .subscribe((currentUser: User) => {
                this.sender = currentUser;
                this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);//pega soemnte um chat
                this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);
                if (this.recipient.photo) {
                    this.chat1
                        .first()
                        .subscribe((chat: Chat) => {
                            this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
                        });
                }
                let doSubscription = () => {
                    this.messages.subscribe((messages: Message[]) => {
                            this.scrollToBottom();
                        });
                };
                this.messages = this.messageService.getMessages(this.sender.$key, this.recipient.$key);
                this.messages.first().subscribe((messages: Message[]) => {
                        if (messages.length === 0) {//se for igual a 0 nao existe msmg na lista
                            this.messages = this.messageService.getMessages(this.recipient.$key, this.sender.$key);//busca ao contrario
                            doSubscription();
                        } else {
                            
                            doSubscription();
                        }
                    });
            });}
            if(this.ativarGrupo){
                //pegar remetente grupo
                this.userService.currentUser //user logado
                .first()//somente primeiro valor
                .subscribe((currentUser: User) => { 
                    this.sender = currentUser;  //sender recebe user logado
                    this.chatGroup1 = this.chatGroupService.getDeepChat(this.sender.$key, this.recipientGroup.$key);//pega soemnte um chat
                    if (this.recipientGroup.photo) {
                        this.chatGroup1
                            .first()
                            .subscribe((chat: Membros) => {
                                this.chatGroupService.updatePhoto(this.chat1, chat.photo, this.recipientGroup.photo);
                            });
                    }
                    let doSubscription = () => {
                        this.messages.subscribe((messages: MessageGroup[]) => {
                                this.scrollToBottom();
                            });
                    };
                    this.messages = this.messageService.getMessagesGroup(this.sender.$key, this.recipientGroup.$key);
                    this.messages.first().subscribe((messages: MessageGroup[]) => {
                            if (messages.length === 0) {//se for igual a 0 nao existe msmg na lista
                                this.messages = this.messageService.getMessagesGroup(this.sender.$key, this.recipientGroup.$key);//busca ao contrario
                                doSubscription();
                            } else {
                                
                                doSubscription();
                            }
                        });
                });
            }
    }

    //RECEBE MENSAGEM DA VIEW 
    sendMessage(newMessage: string): void {
        if (newMessage) {//se existir msm 
            let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
            this.messageService.create(
                new Message(
                    this.sender.$key,
                    newMessage,
                    currentTimestamp
                ),
                this.messages 
            ).then(() => {
                this.chat1
                    .update({
                        lastMessage: newMessage,
                        timestamp: currentTimestamp
                    });
                this.chat2
                    .update({
                        lastMessage: newMessage,
                        timestamp: currentTimestamp
                    });
            });
        }
    }

    //RECEBE MENSAGEM DA VIEW GRUPO
    sendMessageGroup(newMessage: string): void {
        if (newMessage) {//se existir msm 
            let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
            this.messageService.createMessageGroup(this.sender.$key, newMessage, currentTimestamp, 
                this.recipientGroup.$key, this.messages, this.sender.name
            ).then(() => {
                this.chatGroup1
                    .update({
                        lastMessage: newMessage,
                        timestamp: currentTimestamp
                    });
            });
        
            this.groupsService.groupMembros(this.recipientGroup)
            .subscribe(membros => {
              membros.forEach(membro => {
                this.groupsService.atualizarDadosGrupo(membro.membro, this.recipientGroup.$key, currentTimestamp,
                newMessage, this.sender.name);  
              });
            })
        }
    }

    //
    private scrollToBottom(duration?: number): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(duration || 300);
            }
        }, 50);
    } 

    public mostrarMembros(grupo: Groups): void{
        console.log("Vai mostrar membros!");
        this.mostrarMembrosView = true;
        this.membros = this.groupsService.groupMembros(grupo);
        
    }

    //Abrir perfil do Match
    public abrirPerfilMatch(userMatch: Chat): void{
        this.navCtrl.push(PerfilMatchPage, {
            userMatch: userMatch
        });
    }

    //Abrir perfil do Match
    public abrirPerfilGrupo(grupo: Groups): void{
        console.log("Nome: "+grupo.name);
        this.navCtrl.push(PerfilGrupoPage, {
            grupo: grupo
        });
    }
}
