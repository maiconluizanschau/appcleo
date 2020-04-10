import { Groups } from './../../models/groups.model';
import { RoleConfig } from './../../models/roleconfig.model';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { BaseService } from "../base/base";
import { AuthService } from './../auth/auth';
import { Config } from './../../models/config.model';


@Injectable()
export class RoleConfiguracaoService extends BaseService {

  //configUser: FirebaseObjectObservable<Config>;
  idUser: string;
  roles2: FirebaseListObservable<RoleConfig[]>;
  groups2: FirebaseListObservable<Groups[]>;
  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthService,

  ) {
    super();//EXTENDS BaseService -> Trata erros   
    this.idUser = this.authService.getUid();
  }

  //BUSCA DOS INTERRESSES DO USER ROLE CONFIG
  public buscaRoleConfigMostrar(): FirebaseObjectObservable<RoleConfig> {
    return <FirebaseObjectObservable<RoleConfig>>this.db.object(`/role/${this.authService.getUid()}`)
    }

  //BUSCA ROLE REFERENTES A BALADA
  public buscaRole(tipo: string): FirebaseListObservable<RoleConfig[]> {
    this.roles2 = <FirebaseListObservable<RoleConfig[]>>this.db.list(`/role/`, {
      query: {
        orderByChild: tipo, // filtrando pelo campo "voto"
        equalTo: true, // e que tnha o valor true
      }
    }).map((roles2: RoleConfig[]) => {
      return roles2.filter((role3: RoleConfig) => role3.key !== this.idUser);
    }) 
      .catch(this.handleObservableError);
    return this.roles2;
  }

  //BUSCA GRUPOS 
  public buscaGrupo(tipo: string): FirebaseListObservable<Groups[]> {
    return <FirebaseListObservable<Groups[]>>this.db.list(`/groups/`, {
      query: {
        orderByChild: 'tipo', // filtrando pelo campo "tipo"
        equalTo: tipo, // e que tenha o valor recebido por parametro 
      }
    })
      .catch(this.handleObservableError);
  }

  //ALTERAR PARA REMOVER A PAGE INTRO
  public alterarIntroConfig() {
    this.db.database.ref(`/config/${this.idUser}`)
      .update(
      {
        intro: false,
      }
      )

  }

  //BUSCA DOS INTERRESSES DO USER
  public buscaConfig(): FirebaseObjectObservable<Config> {
    return <FirebaseObjectObservable<Config>>this.db.object(`/config/${this.idUser}`)
      .catch(this.handleObservableError);

  }

  //FAZ GRAVAÇÃO DS INTERRESES DO USER EM ROLE
  public gravaInteresseRole(val: boolean, tipo: string) {
    console.log("Vai gravar interesse em "+tipo)
    let refeConfig = this.db.database.ref(`/conversa/${this.idUser}`);
    let refeConfigRelacao = this.db.database.ref(`/config/${this.idUser}`);
    let refeConfigRole = this.db.database.ref(`/role/${this.idUser}`);
    if (tipo == "Balada") {
        console.log(+tipo +" "+val);
        refeConfigRole.update(
          {
            balada: val 
          }
        )
    }
    else if (tipo == "Show") {
        console.log("Show true");
        refeConfigRole.update(
          {
            show: val,
          }
        )
    }
    else if (tipo == "Beber") {
          console.log("Beber true");
          refeConfigRole.update(
            {
              beber: val,
            }
          )
      }
      else if (tipo == "Comer") {
          console.log("Comer true");
          refeConfigRole.update(
            {
              comer: val,
            }
          )
      }
      else if (tipo == "Academia") {
          console.log("Academia true");
          refeConfigRole.update(
            {
              academia: val,
            }
          )
      }
      else if (tipo == "Esporte") {
          console.log("Restaurante true");
          refeConfigRole.update(
            {
              esporte: val,
            }
          )
      }
      else if (tipo == "role") {
        if (val === true) {
          console.log("Role true");
          refeConfigRole.update(
            {
              roleSerBuscado: true,
              key: this.idUser,
            }
          )
          refeConfigRelacao.update(
            {
              relacaoSerBuscado: false,
            }
          )
          refeConfig.update(
            {
              conversaSerBuscado: false,
            }
          )
        }
        else {
          console.log("Role false");
          refeConfigRole.update(
            {
              roleSerBuscado: false,
            }
          )
        }
      }
  }

  //FAZ GRAVAÇÃO DS INTERRESES DO USER
  public gravaInteresse(val: boolean, genero: string) {
    let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
    if (genero == "Mas") {
      if (val === true) {
        console.log("H true");
        refeConfig.update(
          {
            masculino: true,
          }
        )
      }
      else {
        console.log("H false");
        refeConfig.update(
          {
            masculino: false,
          }
        )
      }
    }
    else if (genero == "Fem") {
      if (val === true) {
        console.log("F true");
        refeConfig.update(
          {
            feminino: true,
          }
        )
      }
      else {
        console.log("F false");
        refeConfig.update(
          {
            feminino: false,
          }
        )
      }
    }
  }

    //FAZ GRAVAÇÃO DS INTERRESES DO USER
    public gravaInteresseSerBuscado(val: boolean, genero: string) {
      let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
      if (genero == "Mas") {
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
    let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
    refeConfig.update(
      {
        faixaInicio: range.lower,
        faixaFim: range.upper,
      }
    )
  }

  //FAZ GRAVAÇÃO DO ATIVO E PASSIVO
  public gravaAtivo(atv: Boolean) {
  this.db.database.ref(`/config/${this.idUser}`)
    .update(
      {
        ativo: atv
      }
    )
  }

}
