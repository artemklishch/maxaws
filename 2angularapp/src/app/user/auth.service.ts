import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { User } from "./user.model";

import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import * as AWS from "aws-sdk/global";

const POOL_DATA = {
  UserPoolId: "us-east-1_RnDlNu9H5", // Your user pool id here
  ClientId: "1bqhdgoebcgp30t3vn7rehdv94", // Your client id here
};
const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;

  constructor(public router: Router) {}
  signUp(username: string, email: string, password: string): void {
    // this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password,
    };
    // пароль и имя пользователя тут по умолчанию, а почту мы добавляем дополнительно, поэтому и пишем объект ниже
    const emailAttribute = {
      Name: "email",
      Value: user.email,
    };
    const attrList: CognitoUserAttribute[] = [];
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(
      user.username,
      user.password,
      attrList,
      null,
      function (err, result) {
        if (err) {
          console.log("error happend", err);
          // this.authDidFail.next(true);
          this.authIsLoading.next(false);
          return;
        }
        // this.authDidFail.next(false);
        // this.authIsLoading.next(false);
        this.registeredUser = result.user;
        console.log("user name is " + this.registeredUser.getUsername());
      }
    );

    // it was taken from the docs
    // var poolData = {
    //   UserPoolId: 'us-east-1_RnDlNu9H5', // Your user pool id here
    //   ClientId: '1bqhdgoebcgp30t3vn7rehdv94', // Your client id here
    // };
    // var userPool = new CognitoUserPool(poolData);

    // var attributeList = [];

    // var dataEmail = {
    //   Name: 'email',
    //   Value: 'email@mydomain.com',
    // };

    // var dataPhoneNumber = {
    //   Name: 'phone_number',
    //   Value: '+15555555555',
    // };
    // var attributeEmail = new CognitoUserAttribute(dataEmail);
    // var attributePhoneNumber = new CognitoUserAttribute(
    //   dataPhoneNumber
    // );

    // attributeList.push(attributeEmail);
    // attributeList.push(attributePhoneNumber);

    // userPool.signUp('username', 'password', attributeList, null, function(
    //   err,
    //   result
    // ) {
    //   if (err) {
    //     alert(err.message || JSON.stringify(err));
    //     return;
    //   }
    //   var cognitoUser = result.user;
    //   console.log('user name is ' + cognitoUser.getUsername());
    // });
  }
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        console.log("error occured", err);
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
        return;
      }
      that.authDidFail.next(false);
      that.authIsLoading.next(false);
      that.router.navigate(["/"]);
      console.log("call result: " + result);
    });
  }
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    const that = this;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: CognitoUserSession) {
        that.authStatusChanged.next(true);
        that.authDidFail.next(false);
        that.authIsLoading.next(false);
        console.log("result", result);
      },
      onFailure: function (error) {
        that.authDidFail.next(true);
        that.authIsLoading.next(false);
        console.log("error", error);
      },
    });
    this.authStatusChanged.next(true);

    // var authenticationData = {
    //   Username: 'username',
    //   Password: 'password',
    // };
    // var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    //   authenticationData
    // );
    // var poolData = {
    //   UserPoolId: '...', // Your user pool id here
    //   ClientId: '...', // Your client id here
    // };
    // var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    // var userData = {
    //   Username: 'username',
    //   Pool: userPool,
    // };
    // var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    // cognitoUser.authenticateUser(authenticationDetails, {
    //   onSuccess: function(result) {
    //     var accessToken = result.getAccessToken().getJwtToken();

    //     //POTENTIAL: Region needs to be set if not already set previously elsewhere.
    //     AWS.config.region = '<region>';

    //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //       IdentityPoolId: '...', // your identity pool id here
    //       Logins: {
    //         // Change the key below according to the specific region your user pool is in.
    //         'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result
    //           .getIdToken()
    //           .getJwtToken(),
    //       },
    //     });

    //     //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
    //     AWS.config.credentials.refresh(error => {
    //       if (error) {
    //         console.error(error);
    //       } else {
    //         // Instantiate aws sdk service objects now that the credentials have been updated.
    //         // example: var s3 = new AWS.S3();
    //         console.log('Successfully logged!');
    //       }
    //     });
    //   },

    //   onFailure: function(err) {
    //     alert(err.message || JSON.stringify(err));
    //   },
    // });
  }
  getAuthenticatedUser() {
    // получаем объет пользователя
    return userPool.getCurrentUser();
  }
  logout() {
    this.getAuthenticatedUser().signOut(); // выходим
    this.authStatusChanged.next(false);
  }
  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
        user.getSession((err, session) => {
          if (err) {
            observer.next(false);
          } else {
            if (session.isValid()) {
              observer.next(true);
            } else {
              observer.next(false);
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe((auth) =>
      this.authStatusChanged.next(auth)
    );
  }
}
