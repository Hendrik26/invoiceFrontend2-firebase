import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class LoginUser {
    id: string;
    email: string;
    authorityLevel: number;
    created: Date;
    providerId: string;
}
