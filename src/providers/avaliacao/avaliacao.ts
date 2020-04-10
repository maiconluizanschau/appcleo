import { Avaliacao } from './../../models/avaliacao.model';
import { AuthService } from './../auth/auth';

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { BaseService } from '../base/base';


@Injectable()
export class AvaliacaoProvider extends BaseService {


  constructor(
    public db: AngularFireDatabase,
    public authService: AuthService
    ) {
    super();
  }

  createAvaliacao(uid: string, iduser: string, valores: object): firebase.Promise<void> {
    return this.db.object(`/avaliacoes/${iduser}/${uid}`)
      .set(valores)
      .catch(this.handlePromiseError);
  }

  public buscaAvaliacao(): FirebaseListObservable<Avaliacao[]>{
    return <FirebaseListObservable<Avaliacao[]>>this.db.list(`/avaliacoes/${this.authService.getUid()}`)
  }

}
