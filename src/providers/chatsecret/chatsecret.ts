import { User } from './../../models/user.models';
import { Chatsecret } from './../../models/chatsecret.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { BaseService } from "../base/base";


import * as firebase from 'firebase/app';

@Injectable()
export class ChatSecretService extends BaseService {

  chatsecret: FirebaseListObservable<Chatsecret[]>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
    this.setChatsecret();
  }

  //CRIAR LISTA DE CHATS DO USER LOGADO
  private setChatsecret(): void {
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {//OUVINDO AUTERAÇão DO AUTSTATE
        if (authUser) {//se user estiver logado 
          this.chatsecret = <FirebaseListObservable<Chatsecret[]>>this.db.list(`/chatsecret/${authUser.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chatsecret[]) => {
            return chats.reverse();//rotorno ordem descrescente lista contatos
          }).catch(this.handleObservableError);
        }
      });
  }

  //CRIA NOVOS CHATS ENTRE USUARIOS
  create(chatsecret: Chatsecret, userId1: string, userId2: string): firebase.Promise<void> {
    return this.db.object(`/chatsecret/${userId1}/${userId2}`)
      .set(chatsecret)//salva chat
      .catch(this.handlePromiseError);
  }

  //BUSCA UM CHATSECRET ESPECIFICO
  getDeepChatsecret(userId1: string, userId2: string): FirebaseObjectObservable<Chatsecret> {
    return <FirebaseObjectObservable<Chatsecret>>this.db.object(`/chatsecret/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  //Passou 48h e pessoa quer continuar conversa
  public alterarStatusConversaRelacionamento(userChatKey: string, userKey: string, status: String){
    this.db.object(`/chatsecret/${userKey}/${userChatKey}`)
    .update({
      passou48h: status,
    })
    .catch(this.handlePromiseError);   
  }

  votoSecret(like: boolean, recipientUserKey: string, currentUserKey: string){ 
    let refeVotoSecret = this.db.database.ref(`/votoSecret/${currentUserKey}/${recipientUserKey}`);
        refeVotoSecret.set(
          {
            key: recipientUserKey,
            voto: like 
          }
        )
  }

  updatePhoto(chatsecret: FirebaseObjectObservable<Chatsecret>, chatsecretPhoto: string, recipientUserPhoto: string): firebase.Promise<boolean> {
    if (chatsecretPhoto != recipientUserPhoto) {
      return chatsecret.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }

}
