import { RoleConfig } from './../../models/roleconfig.model';
import { ConversaConfig } from './../../models/conversaconfig.model';
import { Config } from './../../models/config.model';
import { GroupsConfiguracaoService } from './../../providers/groups/groups';
import { RoleConfiguracaoService } from './../../providers/roleconfig/roleconfig';
import { ConversaConfiguracaoService } from './../../providers/conversaconfig/conversaconfig';
import { AuthService } from './../../providers/auth/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { HomePage } from './../home/home';
import { UserService } from './../../providers/user/user';
import { Component } from '@angular/core';
import { User } from '../../models/user.models';
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
import { NavController, ModalController, IonicPage, AlertController, Loading, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ModalPage } from '../modal/modal';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  private listConfig: FirebaseObjectObservable<Config>;
  private listaConversaConfig: FirebaseObjectObservable<ConversaConfig>;
  private listaRoleConfig: FirebaseObjectObservable<RoleConfig>;
  public rangeObject: any = { lower: 18, upper: 60 };

  toggleStatusH: boolean;
  toggleStatusM: boolean;
  toggleStatusHBuscado: boolean;
  toggleStatusMBuscado: boolean;
  toggleStatusRelacao: boolean;
  genero: string;
  loading: Loading;
  toggleStatusArLivre: boolean;
  toggleStatusBar: boolean;
  toggleStatusCafe: boolean;
  toggleStatusCinema: boolean;
  toggleStatusLeitura: boolean;
  toggleStatusRestaurante: boolean;
  toggleStatusConversa: boolean;
  toggleStatusRole: boolean;
  toggleStatusBalada: boolean;
  toggleStatusShow: boolean;
  toggleStatusComer: boolean;
  toggleStatusBeber: boolean;
  toggleStatusEsporte: boolean;
  toggleStatusAcademia: boolean;
  idUser: string;

  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public configService: ConfiguracaoService,
    public modalCtrl: ModalController,
    public db: AngularFireDatabase,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public ConfigService: ConfiguracaoService,
    public conversaConfigService: ConversaConfiguracaoService,
    public alertCtrl: AlertController,
    public conversaConfiguracaoService: ConversaConfiguracaoService,
    public ConfiguracaoService: ConversaConfiguracaoService,
    public roleConfiguracaoService: RoleConfiguracaoService,
    public groupsConfiguracaoService: GroupsConfiguracaoService,
  ) {
    this.getGenero();
  }

  //VERIFICAÇÂO SE SER ESTA LOGADO
  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }
  ionViewWillEnter() {
    this.buscaPreConfiguracoes();
  }


  private getGenero() {
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.genero = currentUser.genero;
        this.idUser = currentUser.$key;
      });
  }

  public info(tipo: number) {
    this.navCtrl.push(ModalPage)
    //this.modalCtrl.create('ModalPage').present();
  }

  //DESABILITAR PAGINA DE INTRO
  private irHome() {
    this.configService.alterarIntroConfig();
    this.navCtrl.setRoot(HomePage);
  }

    //FAZER BUSCA DAS CONFIGURAÇÕES JÁ SALVAS NO BD
    private buscaPreConfiguracoes() {
      this.listConfig = this.ConfigService.buscaConfig();
      this.listConfig.first()
          .subscribe((config: Config) => {
              this.toggleStatusH = config.masculino;//envia para view
              this.toggleStatusM = config.feminino;
              this.rangeObject.lower = config.faixaInicio;
              this.rangeObject.upper = config.faixaFim;
              this.toggleStatusHBuscado = config.masculinoSerBuscado;
              this.toggleStatusMBuscado = config.femininoSerBuscado;
              this.toggleStatusRelacao = config.relacaoSerBuscado;
          });
      this.listaConversaConfig = this.conversaConfigService.buscaConversaConfigMostrar();
      this.listaConversaConfig.first()
          .subscribe((config: ConversaConfig) => {
              this.toggleStatusConversa = config.conversaSerBuscado;//envia para view
              this.toggleStatusBar = config.bar;
              this.toggleStatusCafe = config.cafe;
              this.toggleStatusCinema = config.cinema;
              this.toggleStatusArLivre = config.arlivre;
              this.toggleStatusLeitura = config.leitura;
              this.toggleStatusRestaurante = config.restaurante;
          });
      this.listaRoleConfig = this.roleConfiguracaoService.buscaRoleConfigMostrar();
      this.listaRoleConfig.first()
          .subscribe((config: RoleConfig) => {
              this.toggleStatusRole = config.roleSerBuscado;//envia para view
              this.toggleStatusBalada = config.balada;
              this.toggleStatusShow = config.show;
              this.toggleStatusComer = config.comer;
              this.toggleStatusBeber = config.beber;
              this.toggleStatusAcademia = config.academia;
              this.toggleStatusEsporte = config.esporte;
          });
      //BUSCA DO GENERO    
      this.userService.currentUser
          .first()
          .subscribe((currentUser: User) => {
              this.genero = currentUser.genero;
              if (this.genero == "Masculino" || this.genero == "Outros") {
                  //this.toggleStatusM = false;

              }
          });

      //this.loading.dismiss(); //tira o carregando...
  }

  //ENVIANDO A ESCOLHA TIPO HOMEM
  private Change_Toggle_Homens(bval: boolean) {
    let genero = "Mas";
    this.configService.gravaInteresse(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO MULHER
  private Change_Toggle_Mulheres(bval: boolean) {
    let genero = "Fem";
    this.configService.gravaInteresse(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO CONVERSA
  private Change_Toggle_Conversa(bval: boolean, tipo: string) {
    //let tipo = "Conversa";
    if(tipo === 'conversa' && bval === true){
      this.toggleStatusConversa = true;
      this.toggleStatusRelacao = false;
      this.toggleStatusRole = false;
  }
  this.conversaConfiguracaoService.gravaInteresseConversa(bval, tipo, this.idUser);
  }

  //ENVIANDO A ESCOLHA TIPO RELAÇÃO
  private Change_Toggle_Relacao(bval: boolean, tipo: string) {
    //let tipo = "Conversa";
    if(tipo === 'relacao' && bval === true){
        this.toggleStatusConversa = false;
        this.toggleStatusRelacao = true;
        this.toggleStatusRole = false;
    }
    this.configService.gravaInteresse(bval, tipo);
  }

  //ENVIANDO A ESCOLHA TIPO ROLE
  private Change_Toggle_Role(bval: boolean, tipo: string) {
    //let tipo = "Conversa";
    if(tipo === 'role' && bval === true){
        this.toggleStatusConversa = false;
        this.toggleStatusRelacao = false;
        this.toggleStatusRole = true;
    }
    this.roleConfiguracaoService.gravaInteresseRole(bval, tipo);
  }

  //ENVIANDO A ESCOLHA TIPO MULHER
  private Change_Toggle_Mulheres_Buscado(bval: boolean) {
    let genero = "Fem";
    this.configService.gravaInteresseSerBuscado(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO HOMEM
  private Change_Toggle_Homens_Buscado(bval: boolean) {
    let genero = "Mas";
    this.configService.gravaInteresseSerBuscado(bval, genero);
  }


  //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
  /**private Change_Toggle_AtivoPasssivo(atv: boolean) {
    if (this.genero == "Masculino" || this.genero == "Outros") {
      if (atv == true) {
        this.toggleStatusM = false;//desabilita toggle mulher
        this.configService.gravaAtivo(atv);
        let genero = "Fem";
        this.configService.gravaInteresse(false, genero);
      }
      else if (atv == false) {
        this.configService.gravaAtivo(atv);
      }
    } else if ("Feminino") {
      if (atv == true) {
        this.configService.gravaAtivo(atv);
      }
      else if (atv == false) {
        this.configService.gravaAtivo(atv);
      }
    }

  }**/

  private faixa(range: any) {
    this.ConfigService.gravaFaixa(range);
}
}