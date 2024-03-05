import { Hostel, Student } from "@/types";
import { COLLECTION, ROLES } from "@/types/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default class StudentService {
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
    this.signUp = this.signUp.bind(this);
    this.findAll = this.findAll.bind(this);
    this.count = this.count.bind(this);
    this.assignToHostel = this.assignToHostel.bind(this);
    this.approve = this.approve.bind(this);
    this.countUnapproved = this.countUnapproved.bind(this);
  }

  async profile() {
    return new Promise<Student>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const q = query(
          collection(this.db, COLLECTION.STUDENTS),
          where("userId", "==", this.user.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const profile = {
            id: doc.id,
            ...doc.data(),
          };

          resolve(profile as unknown as Student);
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // bursar
  async signUp(
    params: Pick<
      Student,
      | "DOB"
      | "dept"
      | "displayName"
      | "email"
      | "gender"
      | "guardian"
      | "guardianPhone"
      | "level"
      | "phoneNo"
      | "trackNo"
    > & { password: string }
  ) {
    return new Promise<Student>(async (resolve, reject) => {
      try {
        if (this.user) throw new Error("You cannot perform this operation");

        const result = await axios({
          url: `/api/create-student`,
          method: "POST",
          data: params,
        });
        resolve(result.data);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAll() {
    return new Promise<Student[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const q = query(collection(this.db, COLLECTION.STUDENTS));
        const querySnapshot = await getDocs(q);
        const students: Student[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          students.push({ id: doc.id, ...data } as Student);
        });

        (async function () {
          for (let i = 0; i < students.length; i++) {
            const element = students[i];
            if (!element.hostelId) continue;
            const hostelSnapshot = await getDoc(element.hostelId);

            if (hostelSnapshot.exists()) {
              const data = hostelSnapshot.data();
              const hostel = { ...data, id: hostelSnapshot.id } as Hostel;
              students[i].hostel = hostel;
            }
          }
          resolve(students);
        })();
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const coll = collection(this.db, COLLECTION.STUDENTS);
        const q = query(coll);
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        resolve(count);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async countUnapproved() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const q = query(
          collection(this.db, COLLECTION.STUDENTS),
          where("approved", "==", false)
        );

        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        resolve(count);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async assignToHostel(hostelId: string, room: number) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const profile = await this.profile();

        const hostelCol = collection(this.db, COLLECTION.HOSTELS);
        const hostelDoc = doc(hostelCol, hostelId);

        const studentRef = doc(this.db, COLLECTION.STUDENTS, profile.id);
        await updateDoc(studentRef, { hostelId: hostelDoc, room });
        resolve();
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async approve(studentId: string, status: boolean) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const studentRef = doc(this.db, COLLECTION.STUDENTS, studentId);
        await updateDoc(studentRef, { approved: status });
        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
