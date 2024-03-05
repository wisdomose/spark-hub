import { Hostel, Potter } from "@/types";
import { COLLECTION } from "@/types/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default class PotterService {
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

    this.createOne = this.createOne.bind(this);
    this.findAll = this.findAll.bind(this);
    this.profile = this.profile.bind(this);
    this.count = this.count.bind(this);
    this.assignHostel = this.assignHostel.bind(this);
  }

  async profile() {
    return new Promise<Potter>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const q = query(
          collection(this.db, COLLECTION.POTTERS),
          where("userId", "==", this.user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const profile = {
            id: doc.id,
            ...doc.data(),
          };
          resolve(profile as unknown as Potter);
        } else throw new Error("Failed to find potter profile");
      } catch (error: any) {
        console.error(error);
        reject(error.message);
      }
    });
  }

  async findAll(params?: { hasHostel: boolean }) {
    const { hasHostel } = params ?? {};
    return new Promise<Potter[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const q = query(collection(this.db, COLLECTION.POTTERS));
        const querySnapshot = await getDocs(q);
        let potters: Potter[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          potters.push({ id: doc.id, ...data } as Potter);
        });

        (async function () {
          for (let i = 0; i < potters.length; i++) {
            const element = potters[i];
            if (!element.hostelId) continue;
            const hostelSnapshot = await getDoc(element.hostelId);

            if (hostelSnapshot.exists()) {
              const data = hostelSnapshot.data();
              const hostel = { ...data, id: hostelSnapshot.id } as Hostel;
              potters[i].hostel = hostel;
            }
          }

          if (hasHostel === true) {
            potters = potters.filter((potter) => !!potter?.hostelId);
          } else if (hasHostel === false) {
            potters = potters.filter((potter) => !potter?.hostelId);
          }
          resolve(potters);
        })();

        // resolve(potters);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async createOne(params: { email: string; displayName: string }) {
    return new Promise<Potter>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const token = await this.user.getIdToken();
        const result = await axios({
          url: `/api/create-potter`,
          method: "POST",
          data: params,
          headers: {
            Authorization: token,
          },
        });
        resolve(result.data);
      } catch (error: any) {
        console.log(error.response);
        reject(error.response?.data ?? error.message);
      }
    });
  }

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const coll = collection(this.db, COLLECTION.POTTERS);
        const q = query(coll);
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        resolve(count);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async assignHostel({
    potterId,
    hostelId,
  }: {
    hostelId: string;
    potterId: string;
  }) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const hostelCol = collection(this.db, COLLECTION.HOSTELS);
        const hostelDoc = doc(hostelCol, hostelId);

        const potterRef = doc(this.db, COLLECTION.POTTERS, potterId);
        await updateDoc(potterRef, { hostelId: hostelDoc });
        resolve();
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
