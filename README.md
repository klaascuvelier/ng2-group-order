# ng2-group-order

This is a small application I created using Angular 2 and TypeScript.
Be sure to read more about it [in my blog post](https://klaascuvelier.io/2016/01/angular2-firebase-ordering-prototype/).

## Usage

**IMPORTANT**
This code is just the result of a small challenge I took upon myself, this is not production ready.

[ng2-webpack](https://github.com/ocombe/ng2-webpack) was used as a base for my app.
If you really want to run this yourself, look up the instructions in the ng2-webpack repository.

You will have to these things:
* create a Firebase account
* create a Meetup OAuth2 client
* create a `config.ts` file in `./src/` and use these contents with the data of your created clients
````TypeScript
// src/config.ts
export const FIREBASE_ROOT = '';
export const OAUTH2_CLIENT_ID = '';
export const OAUTH2_REDIRECT_URL = '';
export const MEETUP_MEMBER_SELF = '';
````


You will have to create a `firebase.json` file if you'd want to deploy using Firebase's CLI tool.

## Proxy
If you've read my blog post on this project, you'll have noticed I had to use a proxy script to reach the Meetup API.
You can find the script in [proxy.php](./proxy.php)
