import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { makeObservable, observable, action } from "mobx";
import { message } from "antd";

export interface UserObj {
  email?: string;
  password?: string;
}

class UserStore {
  isSignedIn: boolean = false;
  currentUser: string = "";

  constructor() {
    makeObservable(this, {
      isSignedIn: observable,
      signUp: action,
      logIn: action,
      logOut: action,
    });
  }

  signUp = async (userObj: UserObj) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, userObj.email!, userObj.password!)
      .then(() => {
        this.isSignedIn = true;
        this.currentUser = userObj.email!;
        message.success("Your account was successfully created!");
      })
      .catch((err: FirebaseError) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            message.error(
              `The email address is already in use by another account.`
            );
            break;
          default:
            message.error("An error occurred while signing you up.");
            break;
        }
      });
  };

  logIn = async (userObj: UserObj) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, userObj.email!, userObj.password!)
      .then(() => {
        this.isSignedIn = true;
        message.success("Welcome back!");
      })
      .catch((err: FirebaseError) => {
        switch (err.code) {
          case "auth/invalid-credential":
            message.error(`Incorrect email or password.`);
            break;
          default:
            message.error("An error occurred while logging you in.");
            break;
        }
      });
  };

  logOut = async () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        this.isSignedIn = false;
        message.success("Goodbye!");
      })
      .catch((error: FirebaseError) => {
        message.error("An error occurred while logging you out.");
      });
  };
}

export const userStore = new UserStore();
