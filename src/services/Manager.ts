import { Manager } from "@/types";
import { COLLECTION, ROLES } from "@/types/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default class ManagerService {
  auth;
  storage;
  db;
  app;
  user;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();
    this.user = this.auth.currentUser;

    this.profile = this.profile.bind(this);
    this.init = this.init.bind(this);
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          url: `/api/create-manager`,
          method: "POST",
        });
        resolve(result.data);
      } catch (error: any) {
        reject(error.response?.data ?? error.message);
      }
    });
  }

  async profile() {
    return new Promise<Manager>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const q = query(
          collection(this.db, COLLECTION.MANAGER),
          where("userId", "==", this.user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const profile = {
            id: doc.id,
            ...doc.data(),
          };
          resolve(profile as unknown as Manager);
        } else throw new Error("Failed to find manager's profile");
      } catch (error: any) {
        console.error(error);
        reject(error.message);
      }
    });
  }

  async findAll() {}
}
