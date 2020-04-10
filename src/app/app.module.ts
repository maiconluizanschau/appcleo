import { PerfilGrupoPage } from './../pages/perfil-grupo/perfil-grupo';
/* PLUGIN IONIC */
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
//add compartilhamento social
import { SocialSharing } from '@ionic-native/social-sharing';
//push 
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//notification
import { LocalNotifications } from '@ionic-native/local-notifications';
//email
import { EmailComposer } from '@ionic-native/email-composer';

/* ANGULAR FIRE API*/
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from "angularfire2/database";


/* PAGINAS */
import { IntroPage } from '../pages/intro/intro';
import { FlertPage } from '../pages/flert/flert';
import { ChatSecretoPage } from './../pages/chat-secreto/chat-secreto';
import { PerfilPage } from '../pages/perfil/perfil';
import { PerfilMatchPage } from './../pages/perfil-match/perfil-match';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ConfigPage } from '../pages/config/config';
import { ChatPage } from '../pages/chat/chat';
import { ChatListPage } from '../pages/chat_list/chat_list';
import { ModalPage } from './../pages/modal/modal';
import { AvaliacaoPage } from '../pages/avaliacao/avaliacao';


/* PROVIDERS */
import { SecretMessageService } from './../providers/secretmessage/secretmessage';
import { ChatSecretService } from './../providers/chatsecret/chatsecret';
import { MatchService } from './../providers/match/match';
import { UserService } from '../providers/user/user';
import { AuthService } from '../providers/auth/auth';
import { ChatService } from "../providers/chat/chat";
import { MessageService } from "../providers/message/message";
import { ConfiguracaoService } from '../providers/configuracao/configuracao';
import { CameraProvider } from '../providers/camera/camera';
import { AvaliacaoProvider } from '../providers/avaliacao/avaliacao';


/* COMPONENTES */
import { FlashCardComponent } from './../components/flash-card/flash-card.component';
import { MyApp } from './app.component';
import { NewMatchComponent } from './../components/new-match/new-match.component';
import { GroupMembersComponent } from './../components/group-members/group-members';
//import { UserInfoComponent } from './../components/user-info/user-info.component';
//import { UserMenuComponent } from './../components/user-menu/user-menu.component';
import { CustomLoggedHeaderComponent } from "../components/custom-logged-header/custom-logged-header.component";
import { MessageBoxComponent } from "../components/message-box/message-box.component";
import { CustomSecretChatComponent } from '../components/custom-secret-chat/custom-secret-chat';

import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { SwingModule, SwingStackComponent } from 'angular2-swing';
import { LottieAnimationViewModule } from 'ng-lottie';
import { Autosize } from '../components/autosize/autosize';
import { Network } from '@ionic-native/network';

import { Ionic2RatingModule } from 'ionic2-rating';
import { EditarPerfilPage } from '../pages/editar-perfil/editar-perfil';
import { ConversaConfiguracaoService } from '../providers/conversaconfig/conversaconfig';
import { ConversaConfig } from '../models/conversaconfig.model';
import { RoleConfiguracaoService } from '../providers/roleconfig/roleconfig';
import { GroupsConfiguracaoService } from '../providers/groups/groups';
import { ChatGroupService } from '../providers/chatGroup/chatGroup';
import { InfoamizadePage } from '../pages/infoamizade/infoamizade';
import { InfogroupPage } from '../pages/infogroup/infogroup';



/* CONFIGURAÇÕES BANCO */
const firebaseAppConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyDIzgG3f4rRiEBzCOK5yyMp95GBNsLuk6A",
    authDomain: "startup-cleo-6ab96.firebaseapp.com",
    databaseURL: "https://startup-cleo-6ab96.firebaseio.com",
    projectId: "startup-cleo-6ab96",
    storageBucket: "startup-cleo-6ab96.appspot.com",
    messagingSenderId: "407449858691"
};

@NgModule({
    declarations: [
        CapitalizePipe,
        MyApp,
        //PAGES//
        ConfigPage,
        ChatListPage,
        ChatPage,
        HomePage,
        LoginPage,
        FlertPage,
        PerfilPage,
        PerfilMatchPage,
        PerfilGrupoPage,
        TabsPage,
        ChatSecretoPage,
        IntroPage,
        ModalPage,
        EditarPerfilPage,
        InfoamizadePage,
        InfogroupPage,

        AvaliacaoPage,

        //COMPONENTS//
        CustomLoggedHeaderComponent,
        CustomSecretChatComponent,
        MessageBoxComponent,
        NewMatchComponent,
        GroupMembersComponent,
        //UserMenuComponent,
        //UserInfoComponent,
        FlashCardComponent,
        Autosize
    ],

    imports: [
        AngularFireModule.initializeApp(firebaseAppConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp,{
            tabsHideOnSubPages: true
        }),
        SwingModule,
        LottieAnimationViewModule,
        Ionic2RatingModule,
    ],


    bootstrap: [IonicApp],

    entryComponents: [
        ConfigPage,
        ChatListPage,
        ChatPage,
        HomePage,
        LoginPage,
        MyApp,
        FlertPage,
        PerfilPage,
        PerfilMatchPage,
        PerfilGrupoPage,
        TabsPage,
        ChatSecretoPage,
        IntroPage,
        ModalPage,
        EditarPerfilPage,
        AvaliacaoPage,
        InfoamizadePage,
        InfogroupPage
    ],

    providers: [
        AuthService,
        AngularFireAuth,
        AngularFireDatabase,
        ChatService,
        ChatSecretService,
        SecretMessageService,
        Facebook,
        MessageService,
        NativeStorage,
        StatusBar,
        SplashScreen,
        UserService,
        MatchService,
        SwingStackComponent,
        ConfiguracaoService,
        Camera,
        ImagePicker,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        CameraProvider,
        SocialSharing,
        Push,
        Network,
        LocalNotifications,
        EmailComposer,
        FlertPage,
        AvaliacaoProvider,
        ConversaConfiguracaoService,
        //ConversaConfig
        RoleConfiguracaoService,
        GroupsConfiguracaoService,
        ChatGroupService,
        
   
    ]
})
export class AppModule { }
