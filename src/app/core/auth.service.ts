import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Injectable()
export class AuthService {
  public user: Observable<firebase.User>;
  public token: string;
  obsLoggedUser: BehaviorSubject<any>;

  constructor(
    private firebaseAuth: AngularFireAuth
  ) {
    this.user = firebaseAuth.authState;
    this.obsLoggedUser = new BehaviorSubject<any>(null);
  }

  authenticateFirebaseAnonymously() {
    const that = this;
    firebase.auth().signInAnonymously()
    .then(function(user) {
      that.user = user;
      //that.obsLoggedUser.next(user);
      that.getToken();
    })
    .catch(function(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('signInAnonymously ERROR: ', errorCode, errorMessage);
    });
  }

  getToken() {
    const that = this;
    console.log('Notification permission granted.');
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
    .then(function(idToken) {
        that.token = idToken;
        console.log('idToken.', idToken);
        that.obsLoggedUser.next(that.user);
    }).catch(function(error) {
        console.log('idToken ERROR: ', error);
    });
  }

  logout() {
    return this.firebaseAuth
      .auth
      .signOut();
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  logout2() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}
