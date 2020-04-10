import { FirebaseListObservable } from 'angularfire2/database';
import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { Groups } from './../../models/groups.model';
import { Membros } from './../../models/membros.models';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-perfil-grupo',
  templateUrl: 'perfil-grupo.html',
})
export class PerfilGrupoPage {

  membros: FirebaseListObservable<Membros[]>;//lista d membros grupo especifico
  grupo: Groups;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public groupsService: GroupsConfiguracaoService
    ) {}

  ionViewDidLoad() {
    this.grupo = this.navParams.get('grupo');
    this.membros = this.groupsService.groupMembros(this.grupo);
  }

  public sairGrupo(grupo: Groups): void{
    this.groupsService.sairDoGrupo(grupo); 
    this.navCtrl.pop();
    this.navCtrl.pop();
  }

}
