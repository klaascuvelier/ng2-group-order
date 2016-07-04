import { Injectable } from 'angular2/core';
import { Request, RequestOptions, Http, Headers } from 'angular2/http';
import { Storage } from '../storage/storage';
import { User } from '../../classes/user';
import { STORAGE_KEY_USER, STORAGE_KEY_TOKEN } from '../storage/storage';
import { OAUTH2_CLIENT_ID, OAUTH2_REDIRECT_URL, MEETUP_MEMBER_SELF } from '../../../config';

const FETCH_METHOD_GET = 'get';
const CONTENT_TYPE_JSON = 'application/json';
const HTTP_STATUS_OK = 200;

@Injectable()
export class Authentication
{
    http: Http = null;
    storage: Storage = null;

    authenticationUrl : string = '';
    token: string = null;
    user: User;

    constructor (http: Http, storage: Storage)
    {
        console.info('Authentication instance created');

        this.http = http;
        this.storage = storage;

        this.authenticationUrl = `https://secure.meetup.com/oauth2/authorize?client_id=${OAUTH2_CLIENT_ID}` +
            `&response_type=token&redirect_uri=${OAUTH2_REDIRECT_URL}`;

        if (storage.hasKey(STORAGE_KEY_TOKEN)) {
            storage.getItem(STORAGE_KEY_TOKEN).then(token => this.token = token);
        }

        if (storage.hasKey(STORAGE_KEY_USER)) {
            storage.getItem(STORAGE_KEY_USER).then(user => this.user = user);
        }
    }

    isAuthenticated ()
    {
        return this.getUser()
            .then(() => Promise.resolve(true))
            .catch(() => Promise.reject(false));
    }

    setToken (token)
    {
        this.token = token;

        if (token === null) {
            this.storage.removeItem(STORAGE_KEY_TOKEN);
            this.storage.removeItem(STORAGE_KEY_USER);
        }
        else {
            this.storage.setItem(STORAGE_KEY_TOKEN, token);
        }
    }

    getUser () : Promise<User>
    {
        const self = this;
        return new Promise(getUserExecutor);

        function getUserExecutor (resolve, reject)
        {
            if (!self.storage.hasKey(STORAGE_KEY_TOKEN)) {
                reject('no token specified');
                return;
            }
            else {
                self.storage.getItem(STORAGE_KEY_TOKEN).then(onToken);
            }

            function onToken (token)
            {
                const options = new RequestOptions({
                    url: MEETUP_MEMBER_SELF,
                    method: FETCH_METHOD_GET,
                    headers: new Headers({
                        'Accept': CONTENT_TYPE_JSON,
                        'Content-Type': CONTENT_TYPE_JSON,
                        'Authorization': `Bearer ${token}`
                    })
                });

                self.http
                    .request(new Request(options))
                    .subscribe(onResponse, onError);
            }

            function onResponse (response)
            {
                if (response.status === HTTP_STATUS_OK) {
                    const info = response.json();
                    const name = info.name;
                    const id = info.id;
                    const avatar = info.photo ? info.photo.thumb_link : '';

                    const user = User.build({ name, id, avatar });

                    resolve(user);

                    self.storage.setItem(STORAGE_KEY_USER, user);
                    self.user = user;
                }
                else {
                    onError();
                }
            }

            function onError ()
            {
                self.setToken(null);

                console.warn('could not fetch user info');
                reject('could not fetch user info');
            }
        }
    }
}
