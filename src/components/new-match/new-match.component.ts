import { ChatPage } from './../../pages/chat/chat';
import { ChatService } from './../../providers/chat/chat';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { UserService } from './../../providers/user/user';
import { HomePage } from './../../pages/home/home';
import { ChatListPage } from '../../pages/chat_list/chat_list';
import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { User } from '../../models/user.models';
import { Chat } from './../../models/chat.model';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase';

import { AuthService } from "../../providers/auth/auth";

import { ImagePicker } from '@ionic-native/image-picker';
@Component({
  selector: 'new-match',
  templateUrl: 'new-match.component.html'
})
export class NewMatchComponent {
  
  @Input() userLogado: User; //User que estÃ¡ logado 
  @Input() userMatch: User;  //User que foi dado o match
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public db: AngularFireDatabase,
    public authService: AuthService,
    private imagePicker: ImagePicker,
    public viewCtrl: ViewController,
    public chatService: ChatService,
  ) {}


  chat(recipientUser: User): void {  //Envia para o chat com o novo  match
    this.navCtrl.push(ChatPage, {
        recipientUser: recipientUser
    });
  }
  
  //Volta da tela de novo match para a home
  private home(): void {
    this.navCtrl.setRoot(HomePage);
  }

}