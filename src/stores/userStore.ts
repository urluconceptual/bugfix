import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import {
  makeObservable,
  observable,
  action,
  runInAction,
  computed,
} from "mobx";
import { message } from "antd";
import { collection, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";
import { db } from "..";

export interface UserObj {
  id?: string;
  email?: string;
  password?: string;
}

class UserStore {
  users: any = null;
  currentUser: User | null = null;
  openModal: string | null = null;

  constructor() {
    makeObservable(this, {
      isSignedIn: computed,
      signUp: action,
      logIn: action,
      logOut: action,
      currentUser: observable,
      users: observable,
      setCurrentUser: action,
      fetchAllUsers: action,
      openModal: observable,
      setOpenModal: action
    });
  }

  initializeAuthState = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.setCurrentUser(user);
    });
  };

  setCurrentUser = (user: User | null) => {
    this.currentUser = user;
  };

  get isSignedIn() {
    return this.currentUser !== null;
  }

  addToDb = (userObj: UserObj) => {
    setDoc(doc(db, "users", userObj.id!), { email: userObj.email }).catch(
      (err) => {
        throw err;
      }
    );
  };

  signUp = async (userObj: UserObj) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, userObj.email!, userObj.password!)
      .then((res) => {
        userObj.id = res.user.uid;
        this.addToDb(userObj);
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
        message.success("Goodbye!");
      })
      .catch((error: FirebaseError) => {
        message.error("An error occurred while logging you out.");
      });
  };

  fetchAllUsers = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const res = await getDocs(q);
    runInAction(() => {
      this.users = {};
      res.forEach((doc) => {
        this.users[doc.id] = doc.data() as UserObj;
      });
    });
  };

  fetchById = async (userId : string) => {
    const projectRef = doc(db, "users", userId);
    const docSnap = await getDoc(projectRef);
    return docSnap.exists()? docSnap.data() as UserObj : null;
  };

  setOpenModal = (newState: string | null) => {
    this.openModal = newState;
  }
}

export const userStore = new UserStore();
