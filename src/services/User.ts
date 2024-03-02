import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export type LoginResponse = {};

export default class UserService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.login = this.login.bind(this);
  }

  async login({ email, password }: { email: string; password: string }) {
    return new Promise<LoginResponse>(async (resolve, reject) => {
      await signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential) => {
          resolve(userCredential.user);
        })
        .catch((error) => {
          reject(error.code);
          // const errorCode = error.code;
          // const errorMessage = error.message;
        });
    });
  }
}
