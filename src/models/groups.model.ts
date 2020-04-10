import { FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './user.models';
import { List } from 'ionic-angular';
import { UserService } from '../providers/user/user';
export class Groups {

    public $key;
    
    constructor(
        public key: string,
        public name: string,
        public photo: string, 
        public tipo: string,
        public descricao: string,
        public informacao:string,
        //public membros: FirebaseObjectObservable<User>,
        public timestamp: Object,
        public lastmessage: string,
        public nameUserEnviou: string,
        public local: string,
    ) { }

}