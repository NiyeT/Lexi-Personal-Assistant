import auth0 from 'auth0-js';
import { navigateTo } from "gatsby-link";

const AUTH0_DOMAIN = 'bambooasia.auth0.com';
const AUTH0_CLIENT_ID = 'qccAsH6VEBcIferJPPwpPGa2t1Zm9Hh7';

let BASE_URL = '';
// set the callback url for auth0 to be dynamic so it works in all environments.
if (typeof window !== 'undefined') {
  BASE_URL = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '');
}

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  auth0 = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: `${BASE_URL}/callback`,
    audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
  }

  handleAuthentication() {
    if (typeof window !== 'undefined') {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }

        // Return to the homepage after authentication.
        navigateTo('/');
      });
    }
  }

  isAuthenticated() {
    if(typeof window !== 'undefined') {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
      return new Date().getTime() < expiresAt;
    }
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem('user', JSON.stringify(user));
      if (err) {
        console.error(err);
      }
    })
  }

  getUser() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    }
  }

  getUserName() {
    console.log("User: ", this.getUser());
    if (this.getUser()) {
      return this.getUser().name;
    }
  }

  getEmail() {
    if (this.getUser()) {
      return this.getUser().email;
    }
  }

  getPicture() {
    if (this.getUser()) {
      return this.getUser().picture;
    }
  }

  getName() {
    if (this.getUser()) {
      return this.getUser().name;
    }
  }
}
