import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from '@firebase/util'
import { makeObservable, observable, action } from "mobx";
import { message } from 'antd';

export interface UserObj {
  email?: string;
  password?: string;
}

class UserStore {
  isSignedIn: boolean = false;
  currentUser: string = '';

  constructor() {
    makeObservable(this, {
      isSignedIn: observable,
      signUp: action,
      logIn: action
    });
  }

  signUp = async (userObj: UserObj) => {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(
        auth,
        userObj.email!,
        userObj.password!
      );
      this.isSignedIn = true;
      this.currentUser = userObj.email!;
      message.success('Your account was successfully created!');
    } catch (err: unknown) {
        console.log(err);
        if(err instanceof FirebaseError) {
            switch(err.code) {
                case'auth/email-already-in-use':
                    message.error(`The email address is already in use by another account.`);
                    break;
                default:
                    message.error('An error occurred while signing you up.');
                    break;
            }
        }
    }
  };

  logIn = async (userObj: UserObj) => {
    try {
      const auth = getAuth();
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        userObj.email!,
        userObj.password!
      );
      if(userCredentials.user) {
        this.isSignedIn = true;
      }
      message.success('Welcome back!');
    } catch (err: unknown) {
        console.log(err);
        if(err instanceof FirebaseError) {
            switch(err.code) {
                case'auth/invalid-credential':
                    message.error(`Incorrect email or password.`);
                    break;
                default:
                    message.error('An error occurred while logging you in.');
                    break;
            }
        }
    }
  };
}

export const userStore = new UserStore();
