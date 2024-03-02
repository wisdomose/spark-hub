import { Complaint, Hostel } from "@/types";
import { COLLECTION } from "@/types/types";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import StudentService from "./Student";
import PotterService from "./Potter";

export default class ComplaintService {
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

    this.create = this.create.bind(this);
    this.respond = this.respond.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findAllMyComplaints = this.findAllMyComplaints.bind(this);
    // this.findOneOfMyComplaints = this.findOneOfMyComplaints.bind(this);
    this.findAllComplaintsToMe = this.findAllComplaintsToMe.bind(this);
    // this.findOneComplaintToMe = this.findOneComplaintToMe.bind(this);
    // this.findOne = this.findOne.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.resolve = this.resolve.bind(this);
  }

  async create({
    heading,
    complaint,
  }: Pick<Complaint, "heading" | "complaint">) {
    return new Promise<Complaint>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const student = new StudentService();
        const profile = await student.profile();
        if (!profile.hostelId)
          throw new Error("You need to have accomodation first");

        const studentCol = collection(this.db, COLLECTION.STUDENTS);
        const studentDoc = doc(studentCol, profile.id);

        const hostelCol = collection(this.db, COLLECTION.HOSTELS);
        const hostelDoc = doc(hostelCol, profile.hostelId.id);

        const result = await addDoc(
          collection(this.db, COLLECTION.COMPLAINTS),
          {
            response: "",
            heading,
            complaint,
            createdAt: serverTimestamp(),
            resolvedAt: null,
            resolved: false,
            studentId: studentDoc,
            hostelId: hostelDoc,
          }
        );

        // TODO: this is the snapshot not the actual document
        resolve(result as unknown as Complaint);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async respond(complaintId: string, { response }: { response: string }) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        // TODO: check potter is the one that is assigned to that complaint
        const complaintRef = doc(this.db, COLLECTION.COMPLAINTS, complaintId);
        await updateDoc(complaintRef, { response });

        resolve();
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  async resolve(complaintId: string) {
    return new Promise<Boolean>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        // TODO: check potter is the one that is assigned to that complaint
        const complaintRef = doc(this.db, COLLECTION.COMPLAINTS, complaintId);
        await updateDoc(complaintRef, { resolved: true });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // bursar
  async findAll() {
    return new Promise<Complaint[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const q = query(collection(this.db, COLLECTION.COMPLAINTS));
        const querySnapshot = await getDocs(q);
        const complaints: Complaint[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          complaints.push({ id: doc.id, ...data } as Complaint);
        });

        resolve(complaints);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // async findOne(hostelId: string) {}

  // student
  async findAllMyComplaints() {
    return new Promise<Complaint[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const student = new StudentService();
        const profile = await student.profile();

        const q = query(
          collection(this.db, COLLECTION.COMPLAINTS),
          where("studentId", "==", profile.id)
        );
        const querySnapshot = await getDocs(q);
        const complaints: Complaint[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          complaints.push({ id: doc.id, ...data } as Complaint);
        });

        resolve(complaints);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // async findOneOfMyComplaints() {}

  async deleteOne(id: string) {}

  // potter
  async findAllComplaintsToMe() {
    return new Promise<Complaint[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const potter = new PotterService();
        const profile = await potter.profile();

        const q = query(
          collection(this.db, COLLECTION.COMPLAINTS),
          where("hostelId", "==", profile.hostelId)
        );
        const querySnapshot = await getDocs(q);
        const complaints: Complaint[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          complaints.push({ id: doc.id, ...data } as Complaint);
        });

        resolve(complaints);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // async findOneComplaintToMe() {}
}
