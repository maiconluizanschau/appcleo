import { User } from './../../models/user.models';
import { MessageGroup } from './../../models/messageGroup';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { BaseService } from "./../base/base";
import { Message } from '../../models/message.model';

import * as firebase from 'firebase/app';

@Injectable()
export class MessageService extends BaseService {

  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }

  
  create(message: Message, listMessages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return listMessages.push(message)//add nova msm na lista
      .catch(this.handlePromiseError);
  }
  //CRIANDO MENSAGEM GRUPO
  createMessageGroup(userKey: string, msg: string, timestamp: Object, grupokey: string ,listMessages: FirebaseListObservable<Message[]>, name: string): firebase.Promise<void> {
    //listMessages.push(message)//add nova msm na lista
    let refeGroup = this.db.database.ref(`/messagesGroup/${grupokey}`);

    return refeGroup.push(
      {
        grupo: grupokey,
        text: msg,
        timestamp: timestamp,
        userId: userKey,
        nameUserEnviou: name
      }
    )
      .catch(this.handlePromiseError);
  }

  //BUSCA DAS MENSAGENS ENTRE USERS
  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.db.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',  //ordena pelo tempo ultimo enviado
        limitToLast: 30
      }
    }).catch(this.handleObservableError);
  }

  //BUSCA DAS MENSAGENS ENTRE GRUPOS
  getMessagesGroup(userId1: string, grupoId2: string): FirebaseListObservable<MessageGroup[]> {
    return <FirebaseListObservable<MessageGroup[]>>this.db.list(`/messagesGroup/${grupoId2}`, {
      query: {
        orderByChild: 'timestamp',  //ordena pelo tempo ultimo enviado
        limitToLast: 30,
      }
    }).catch(this.handleObservableError);
  }

}
