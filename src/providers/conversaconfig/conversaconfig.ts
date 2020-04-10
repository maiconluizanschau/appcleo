import { User } from './../../models/user.models';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import { BaseService } from "../base/base";
import { AuthService } from './../auth/auth';
import { ConversaConfig } from './../../models/conversaconfig.model';


@Injectable()
export class ConversaConfiguracaoService extends BaseService {

  //configUser: FirebaseObjectObservable<Config>;
  idUser: string;
  conversas: FirebaseListObservable<ConversaConfig[]>;
  conversas2: FirebaseListObservable<ConversaConfig[]>;
  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthService,

  ) {
    super();//EXTENDS BaseService -> Trata erros   
    this.idUser = this.authService.getUid();
    
  }

  //ALTERAR PARA REMOVER A PAGE INTRO
  public alterarIntroConfig() {
    this.db.database.ref(`/conversa/${this.idUser}`)
      .update(
      {
        conversaSerBuscado: false,
      }
      )

  }


  //BUSCA DOS INTERRESSES DO USER CONVERSA CONFIG
  public buscaConversaConfig(): FirebaseObjectObservable<ConversaConfig> {
    return <FirebaseObjectObservable<ConversaConfig>>this.db.object(`/conversa/${this.idUser}`)
      .catch(this.handleObservableError);

  }

  //BUSCA DOS INTERRESSES DO USER CONVERSA CONFIG
  public buscaConversaConfigMostrar(): FirebaseObjectObservable<ConversaConfig> {
  return <FirebaseObjectObservable<ConversaConfig>>this.db.object(`/conversa/${this.idUser}`)
      .catch(this.handleObservableError);
  }

  //BUSCA DOS INTERRESSES DO USER CONVERSA CONFIG
  public buscaConversaConfigMatch(keyMatch: string): FirebaseObjectObservable<ConversaConfig> {
  return <FirebaseObjectObservable<ConversaConfig>>this.db.object(`/conversa/${keyMatch}`)
      .catch(this.handleObservableError);
  }  
  

  //FAZ GRAVAÇÃO DS INTERRESES DO USER EM AMIZADE
  public gravaInteresseConversa(val: boolean, tipo: string, idUser2: string) {

    let refeConfig = this.db.database.ref(`/conversa/${idUser2}`);
    let refeConfigRelacao = this.db.database.ref(`/config/${idUser2}`);
    let refeConfigRole = this.db.database.ref(`/role/${idUser2}`);
    if (tipo == "Bar") {
      if (val === true) {
        console.log("Bar true");
        refeConfig.update(
          {
            bar: true 
          }
        )
      }
      else {
        console.log("Bar false");
        refeConfig.update(
          {
            bar: false
          }
        )
      }
    }
    else if (tipo == "Cafe") {
      if (val === true) {
        console.log("Café true");
        refeConfig.update(
          {
            cafe: true,
          }
        )
      }
      else {
        console.log("Café false");
        refeConfig.update(
          {
            cafe: false,
          }
        )
      }
    }
    else if (tipo == "Leitura") {
        if (val === true) {
          console.log("Leitura true");
          refeConfig.update(
            {
              leitura: true,
            }
          )
        }
        else {
          console.log("Leitura false");
          refeConfig.update(
            {
              leitura: false,
            }
          )
        }
      }
      else if (tipo == "Cinema") {
        if (val === true) {
          console.log("Cinema true");
          refeConfig.update(
            {
              cinema: true,
            }
          )
        }
        else {
          console.log("Cinema false");
          refeConfig.update(
            {
              cinema: false,
            }
          )
        }
      }
      else if (tipo == "ArLivre") {
        if (val === true) {
          console.log("Ar Livre true");
          refeConfig.update(
            {
              arlivre: true,
            }
          )
        }
        else {
          console.log("Ar Livre false");
          refeConfig.update(
            {
              arlivre: false,
            }
          )
        }
      }
      else if (tipo == "Restaurante") {
        if (val === true) {
          console.log("Restaurante true");
          refeConfig.update(
            {
              restaurante: true,
            }
          )
        }
        else {
          console.log("Restaurante false");
          refeConfig.update(
            {
              restaurante: false,
            }
          )
        }
      }
      else if (tipo === 'conversa') {
        if (val === true) {
          console.log("Conversa true");
          refeConfig.update(
            {
              conversaSerBuscado: true,
              //key: this.idUser,
            }
          )
          refeConfigRelacao.update(
            {
              relacaoSerBuscado: false,
            }
          )
          refeConfigRole.update(
            {
              roleSerBuscado: false,
            }
          )
        }
        else if (val === false){
          console.log("Conversa false");
          refeConfig.update(
            {
              conversaSerBuscado: false,
            }
          )
        }
      }
  }

    //FAZ GRAVAÇÃO DS INTERRESES DO USER
    public gravaInteresseSerBuscado(val: boolean, genero: string) {
      let refeConfig = this.db.database.ref(`/conversa/${this.idUser}`);
      if (genero == "Outro") {
        if (val === true) {
          refeConfig.update(
            {
              masculinoSerBuscado: true,
            }
          )
        }
        else {
          refeConfig.update(
            {
              masculinoSerBuscado: false,
            }
          )
        }
      }
      else if (genero == "Fem") {
        if (val === true) {
          refeConfig.update(
            {
              femininoSerBuscado: true,
            }
          )
        }
        else {
          refeConfig.update(
            {
              femininoSerBuscado: false,
            }
          )
        }
      }
    }

  //FAZ GRAVAÇÃO DA FAIXA INTERRESSE DO USER
  public gravaFaixa(range: any) {
    console.log(range);
    let refeConfig = this.db.database.ref(`/conversa/${this.idUser}`);
    refeConfig.update(
      {
        faixaInicio: range.lower,
        faixaFim: range.upper,
      }
    )
  }

  //FAZ GRAVAÇÃO DO ATIVO E PASSIVO
  public gravaAtivo(atv: Boolean) {
  this.db.database.ref(`/conversa/${this.idUser}`)
    .update(
      {
        ativo: atv
      }
    )
  }

  //BUSCA CONVERSAS REFERENTES A BAR
  public buscaConversaBar(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'bar', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }

  //BUSCA CONVERSAS REFERENTES A CAFE
  public buscaConversaCafe(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'cafe', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }

  //BUSCA CONVERSAS REFERENTES A AR LIVRE
  public buscaConversaArlivre(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'arlivre', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }

  //BUSCA CONVERSAS REFERENTES A AR LIVRE
  public buscaConversaCinema(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'cinema', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }
  //BUSCA CONVERSAS REFERENTES A AR LIVRE
  public buscaConversaLeitura(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'leitura', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }
  //BUSCA CONVERSAS REFERENTES A AR LIVRE
  public buscaConversaRestaurante(): FirebaseListObservable<ConversaConfig[]> {
    this.conversas2 = <FirebaseListObservable<ConversaConfig[]>>this.db.list(`/conversa/`, {
      query: {
        orderByChild: 'restaurante', // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((conversas2: ConversaConfig[]) => {
      return conversas2.filter((conversa3: ConversaConfig) => conversa3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.conversas2;
  }
}
