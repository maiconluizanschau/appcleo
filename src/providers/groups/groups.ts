import { VotoGroup } from './../../models/votoGroup';
import { Membros } from './../../models/membros.models';
import { Push } from '@ionic-native/push';
import { User } from './../../models/user.models';
import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

import * as firebase from 'firebase/app';
import { BaseService } from "../base/base";
import { AuthService } from './../auth/auth';
import { ConversaConfig } from './../../models/conversaconfig.model';
import { Groups } from '../../models/groups.model';
import { timestamp } from 'rxjs/operator/timestamp';


@Injectable()
export class GroupsConfiguracaoService extends BaseService {

  groups: FirebaseListObservable<Groups[]>;
  groupsKey: FirebaseListObservable<Membros[]>;
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
    this.setGroups();
  }

  //FAZ CRIAÇÃO DOS GRUPOS
  public createGroup() {
    console.log("Vai criar grupo ")
    let refeGroup = this.db.database.ref(`/users/`);

    refeGroup.push(
      {
        dataNasc: '12/09/1990',
        email: 'cris@delas.com',
        genero: 'Masculino',
        idade: 34,
        local: 'Gramado, Rio Grande do Sul',
        photo: 'https://scontent.fria2-1.fna.fbcdn.net/v/t1.0-9/24059060_1999695726954296_5499812688118454434_n.jpg?_nc_cat=0&oh=686a0418fe1e5cda3fc419530ff0669a&oe=5C015DF4',
        name: 'Cristian',
        sobre: "Crizindelas...",
        sobrenome:'Boff'
        
        //adicionar chave manualmente key do grupo
      }
    )
  }

//BUSCA DE TOTAL DE VOTOS
getVoto(id) {
  return firebase.database().ref('like/' + id + '/').child('like').once('value');
}

//BUSCA DE TOTAL DE VIEW
getView(id) {
  return firebase.database().ref('view/' + id + '/').child('view').once('value');
}

//CONTADOR DE NOVOS VOTOS
setNewVotos(id: string, num: number) {
  return this.db.object('like/' + id + '/').set({ like: num + 1 });
  //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
}

//CONTADOR DE NOVOS VIEWS
setNewView(id: string, num: number) {
  return this.db.object('view/' + id + '/').set({ view: num + 1 });
  //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
}

    public entrarGrupo2(u: User, grupo: Groups, like: boolean, timestamp: any): firebase.Promise<void>{
      console.log("Vai entrar no grupo "+grupo.name)
      if (like) {
        this.getVoto(grupo.key)//busca votos totais
          .then(total => {
            this.setNewVotos(grupo.key, total.val()); //incrmeneta voto
          });
      }
      
      if(like){
        //BUSCA VIEWS TOTAIS
        this.getView(grupo.key)
          .then(total => {
            this.setNewView(grupo.key, total.val()); //incrmeneta view
          });

          let refeGroup3 = this.db.database.ref(`/groupMembers/${grupo.key}/${this.idUser}`);
    
          refeGroup3.update(
            {
              membro: this.idUser,
              voto: like,
              grupo: grupo.key,
              photo: u.photo,
              name: u.name
            ///  local:u.local
            }
          ) 

        let refeGroup = this.db.database.ref(`/membros/${this.idUser}/${grupo.key}`);
    
            refeGroup.update(
              {
                membro: this.idUser,
                grupo: grupo.key,
                descricao: grupo.descricao,
                photo: grupo.photo,
                name: grupo.name,
                timestamp: timestamp,
                informacao: grupo.informacao,
                local: grupo.local,
              }
            )   
        }
        let votoGroup = this.db.database.ref(`/votoGroup/${this.idUser}/${grupo.key}`);
        return votoGroup.update(
            {
              voto: like,
              key: grupo.key
            }
          ) 
 
    }

 //BUSCA PESSOAS QUE FOI DADO FLERTS
 public meusGrupos(minhaKey: string): Array<any[]> {
  let grupos = [];
  this.meusGrupos2(minhaKey)
    .subscribe(gruposKey => {
      gruposKey.forEach(grupo => {
        this.getGrupo(grupo.grupo)
          .subscribe((grupoMeu: Groups) => {
            grupos.push(grupoMeu);
          })
      });
    })
  return grupos;
}

  //CRIAR LISTA DE GRUPOS DO USER LOGADO
  private setGroups(): void {
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {//OUVINDO AUTERAÇão DO AUTSTATE
        if (authUser) {//se user estiver logado 
          this.groupsKey = <FirebaseListObservable<Membros[]>>this.db.list(`/membros/${this.idUser}`, {
            query: {
              orderByChild: 'timestamp',      
            // limitToLast: 30        
            }
          }).map((chats: Membros[]) => {
            return chats.reverse();//rotorno ordem descrescente lista contatos
          })
          .catch(this.handleObservableError);
        }
      });
  }

    //BUSCAR UM UNICO GRUPO
    public getGrupo(key: String): FirebaseObjectObservable<Groups> {
      return <FirebaseObjectObservable<Groups>>this.db.object(`/groups/` + key);
  }

    public meusGrupos2(id: String):FirebaseListObservable<Membros[]>{
      return <FirebaseListObservable<Membros[]>>this.db.list(`/votoGroup/${id}`, {
        query: {
          orderByChild: 'voto', // filtrando pelo campo "voto"
          equalTo: true, // e que tnha o valor true
        }
      })
        .catch(this.handleObservableError);

    }

  //ATUALIZAR DADOS GRUPO
  public atualizarDadosGrupo(membroKey: String, grupokey: String, timestamp: Object, lastMessage: String, nameUser: String): void{ 
    let atualizarMensagemGrupo = this.db.database.ref(`/membros/${membroKey}/${grupokey}`);
    atualizarMensagemGrupo.update(
        {
          timestamp: timestamp,
          lastMessage: lastMessage,
          nameUserEnviou: nameUser
        }
      )    
  }

    public getMembros(user: String): FirebaseListObservable<VotoGroup[]>{
      return <FirebaseListObservable<VotoGroup[]>>this.db.list(`/votoGroup/${user}`, {
      })
        .catch(this.handleObservableError);
    }

    public getGrupos(membro: string): FirebaseListObservable<Membros[]>{
      console.log("Buscando chave dos grupos...");
      return <FirebaseListObservable<Membros[]>>this.db.list(`/membros/${membro}`, {
        //query: {
          //orderByChild: 'voto', // filtrando pelo campo "voto"
          //equalTo: true, // e que tnha o valor true
        //}
      })
        .catch(this.handleObservableError);
    }
    //BUSCA MEMBROS DO GRUPO
    public groupMembros(grupo2: Groups): FirebaseListObservable<Membros[]>{
      //console.log("Buscando membros do grupo: "+grupo2.$key);
      return <FirebaseListObservable<Membros[]>>this.db.list(`/groupMembers/${grupo2.$key}`, {
      })
        .catch(this.handleObservableError);
    }
    
    public sairDoGrupo(grupo: Groups): void{
      console.log("Vai deletar grupo.");
      var db = firebase.database();
      db.ref("membros/"+this.idUser+"/"+grupo.$key).remove();
      db.ref("groupMembers/"+grupo.$key+"/"+this.idUser).remove();
    }
}
