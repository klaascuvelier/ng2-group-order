import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';


import { StorageHelper } from '../storage/storage';
import { User } from '../../classes/user';
import { STORAGE_KEY_USER, STORAGE_KEY_TOKEN } from '../storage/storage';

const FETCH_METHOD_GET = 'get';
const CONTENT_TYPE_JSON = 'application/json';
const HTTP_STATUS_OK = 200;

export const AUTH_PROVIDERS = {
    GITHUB: 'GITHUB'
};

@Injectable()
export class Authentication {
    authenticationUrl: string = '';
    token: string = null;
    user: User;

    constructor(
        private afAuth: AngularFireAuth,
        private http: Http,
        private storage: StorageHelper
    ) {}

    isAuthenticated(): Observable<boolean> {
        return this.getUser().map(user => user !== null);
    }

    login(provider: string): void {
        if (provider === AUTH_PROVIDERS.GITHUB) {
            this.afAuth.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());
        }
        else {
            throw new Error('Unknown auth provider ' + provider);
        }
    }

    logout(): void {
        this.afAuth.auth.signOut();
    }

    setToken(token): void {
        this.token = token;

        if (token === null) {
            this.storage.removeItem(STORAGE_KEY_TOKEN);
            this.storage.removeItem(STORAGE_KEY_USER);
        }
        else {
            this.storage.setItem(STORAGE_KEY_TOKEN, token);
        }
    }

    getUser(): Observable<User|null> {
        return this.afAuth.authState
            .distinctUntilChanged()
            .map(afUser => {
                if (afUser !== null) {
                    const {displayName, email, photoURL, uid} = afUser.providerData[0];

                    return {
                        id: uid,
                        avatar: photoURL,
                        email,
                        name: displayName
                    };
                }

                return null;
            });

        // const self = this;
        // return new Promise(getUserExecutor);
        //
        // function getUserExecutor (resolve, reject)
        // {
        //     if (!self.storage.hasKey(STORAGE_KEY_TOKEN)) {
        //         reject('no token specified');
        //         return;
        //     }
        //     else {
        //         self.storage.getItem(STORAGE_KEY_TOKEN).then(onToken);
        //     }
        //
        //     function onToken (token)
        //     {
        //         const options = new RequestOptions({
        //             url: MEETUP_MEMBER_SELF,
        //             method: FETCH_METHOD_GET,
        //             headers: new Headers({
        //                 'Accept': CONTENT_TYPE_JSON,
        //                 'Content-Type': CONTENT_TYPE_JSON,
        //                 'Authorization': `Bearer ${token}`
        //             })
        //         });
        //
        //         self.http
        //             .request(new Request(options))
        //             .subscribe(onResponse, onError);
        //     }
        //
        //     function onResponse (response)
        //     {
        //         if (response.status === HTTP_STATUS_OK) {
        //             const info = response.json();
        //             const name = info.name;
        //             const id = info.id;
        //             const avatar = info.photo ? info.photo.thumb_link : '';
        //
        //             const user = User.build({ name, id, avatar });
        //
        //             resolve(user);
        //
        //             self.storage.setItem(STORAGE_KEY_USER, user);
        //             self.user = user;
        //         }
        //         else {
        //             onError();
        //         }
        //     }
        //
        //     function onError ()
        //     {
        //         self.setToken(null);
        //
        //         console.warn('could not fetch user info');
        //         reject('could not fetch user info');
        //     }
        // }
    }
}
