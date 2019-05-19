import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import {CustomerType} from './customer-type';

export class LoginUser {
    id: string;
    authorityLevel: number;
    created: Date;
    email: string;
    providerId: string;

    constructor(id: string, authorityLevel: number, created: Date, email: string, providerId: string) {
        this.id = id;
        this.authorityLevel = authorityLevel;
        this.created = created;
        this.email = email;
        this.providerId = providerId;
    }

    public static normalizeUser(inUser: any): LoginUser {

        return new LoginUser(
            inUser.key,
            isNaN(inUser.authorityLevel) || !inUser.authorityLevel ? 0 : inUser.authorityLevel,
            inUser.created.toDate() ? inUser.created.toDate() : new Date(),
            inUser.email ? inUser.email : 'unbekannt',
            inUser.providerId ? inUser.providerId : 'unbekannt'
        );
    }
}
