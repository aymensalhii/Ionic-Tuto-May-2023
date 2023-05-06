import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WindowService } from 'src/app/shared/services/window.service';

import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mode: string = 'tlf';
  emailMode: string = 'signin'
  step: number = 0;
  winRef: any;

  phoneNumber: string = '';
  VerifCode: string = '';

  email: string = '';
  password: string = '';

  constructor(
    windowRef: WindowService,
    private afs: AngularFirestore,
    private route: Router,
    private authService: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.winRef = windowRef;
  }

  ngOnInit() {
  }

  SignUp() {
    this.authService.signUp(this.email, this.password)
    .then(() => console.log('Signed up!'))
    .catch(error => console.error(error));
  }

  Login() {
    this.authService.login(this.email, this.password)
    .then(() => {
      this.afAuth.authState.subscribe(res => {
        console.log(res);
      });
      console.log('Logged in!',)
    })
    .catch(error => console.error(error));
  }
  
  onCodeChanged(e: any) {

  }

  onCodeCompleted(e: any) {
    this.VerifCode = e;
  }

  SendOTP() {
    const auth = getAuth();
    this.winRef.recaptchaVerifier = new RecaptchaVerifier("recaptcha-verifier", {
      "size": "invisible",
    }, auth);

    const appVerifier = this.winRef.recaptchaVerifier;
    console.log(this.phoneNumber);
    signInWithPhoneNumber(auth, '+974'+this.phoneNumber,appVerifier).then((confirmationResult) => {
      console.log('****************')
      this.winRef.confirmationResult = confirmationResult;
      this.step++;
    }).catch((error) => {
      console.log(error);
    });
  }

  verifyCode() {
    this.winRef.confirmationResult.confirm(this.VerifCode).then((result: any) => {
      const user = result.user;
      console.log(user);
      const userDocRef = this.afs.doc(`users/${user!.uid}`);

      userDocRef.valueChanges().subscribe(res => {
        if(res === undefined) {
          userDocRef.set({
            completion: false,
            phone: this.phoneNumber,
            email: '',
            name: '',
            role: '',
            banned: false
          });
          console.log('User Doc created successfully!');
        } else {
          const x = JSON.stringify(res);
          const userData = JSON.parse(x);

          if(!userData.completion) {
            this.route.navigate(['/profile-completion']);
          } else {
            this.route.navigate(['/profile']);
          }
        }
      })
    })
  }

}
