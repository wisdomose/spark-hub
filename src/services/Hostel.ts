import { Hostel, Potter, Student } from "@/types";
import { COLLECTION } from "@/types/types";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
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
import StudentService from "./Student";
import PotterService from "./Potter";

export type ProfileResponse = {};

export default class HostelService {
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
    this.assignOneToPotter = this.assignOneToPotter.bind(this);
    this.editOne = this.editOne.bind(this);
    this.findAll = this.findAll.bind(this);
    this.count = this.count.bind(this);
    this.findMyHostel = this.findMyHostel.bind(this);
    this.findAllMyRoomMates = this.findAllMyRoomMates.bind(this);
    this.findAllStudentsInMyHostel = this.findAllStudentsInMyHostel.bind(this);
    this.findHostelAssignedToMe = this.findHostelAssignedToMe.bind(this);
  }

  async create({
    name,
    noOfRooms,
    personsPerRoom,
    potterId,
  }: Pick<Hostel, "name" | "noOfRooms" | "personsPerRoom"> & {
    potterId: string;
  }) {
    return new Promise<ProfileResponse>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        if (!potterId) throw new Error("You have not selected a picker");

        const potterCol = collection(this.db, COLLECTION.POTTERS);
        const potterDoc = doc(potterCol, potterId);

        const hostel = await addDoc(collection(this.db, COLLECTION.HOSTELS), {
          timestamp: serverTimestamp(),
          name,
          noOfRooms,
          rooms: new Array(noOfRooms).fill(0, 0),
          personsPerRoom,
          potterId: potterDoc,
        });

        // assign hostel to the potter
        const potter = new PotterService();
        await potter.assignHostel({
          potterId,
          hostelId: hostel.id,
        });

        resolve(hostel);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async editOne(
    hostelId: string,
    {
      name,
      noOfRooms,
      personsPerRoom,
    }: Pick<Hostel, "name" | "noOfRooms" | "personsPerRoom">
  ) {}

  async assignOneToPotter({
    potterId,
    hostelId,
  }: {
    potterId: string;
    hostelId: string;
  }) {}

  async findAll() {
    return new Promise<Hostel[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const q = query(collection(this.db, COLLECTION.HOSTELS));
        const querySnapshot = await getDocs(q);
        const hostels: Hostel[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          hostels.push({ id: doc.id, ...data } as Hostel);
        });

        (async function () {
          for (let i = 0; i < hostels.length; i++) {
            const element = hostels[i];
            const potterSnapshot = await getDoc(element.potterId);

            if (potterSnapshot.exists()) {
              const data = potterSnapshot.data();
              const potter = { ...data, id: potterSnapshot.id } as Potter;
              hostels[i].potter = potter;
            }
          }
          resolve(hostels);
        })();
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAllMyRoomMates() {
    return new Promise<Student[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const student = new StudentService();
        const profile = await student.profile();

        if (!profile.hostelId) resolve([]);

        const q = query(
          collection(this.db, COLLECTION.STUDENTS),
          where("hostelId", "==", profile.hostelId),
          where("room", "==", profile.room),
        );
        const querySnapshot = await getDocs(q);
        const students: Student[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          students.push({ id: doc.id, ...data } as Student);
        });

        resolve(students);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findOne(hostelId: string) {
    return new Promise<Hostel>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const docRef = doc(this.db, COLLECTION.HOSTELS, hostelId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const hostel = { id: hostelId, ...docSnap.data() } as Hostel;

          const potterSnapshot = await getDoc(hostel.potterId);

          if (potterSnapshot.exists()) {
            const data = potterSnapshot.data();
            const potter = { ...data, id: potterSnapshot.id } as Potter;
            hostel.potter = potter;
          }
          resolve(hostel);
        } else {
          throw new Error("No Hostel found");
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async deleteOne(hostelId: string) {}

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");

        const coll = collection(this.db, COLLECTION.HOSTELS);
        const q = query(coll);
        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;
        resolve(count);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // picker
  async findHostelAssignedToMe() {
    return new Promise<Hostel>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const potter = new PotterService();
        const profile = await potter.profile();

        if (!profile.hostelId)
          throw new Error("You are not assigned to a hostel");
        const hostel = await this.findOne(profile.hostelId.id);
        resolve(hostel);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAllStudentsInMyHostel() {
    return new Promise<Student[]>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const potter = new PotterService();
        const profile = await potter.profile();

        if (!profile.hostelId)
          throw new Error("You are not assigned to a hostel");

        const q = query(
          collection(this.db, COLLECTION.STUDENTS),
          where("hostelId", "==", profile.hostelId)
        );

        const querySnapshot = await getDocs(q);

        const students: Student[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          students.push({ id: doc.id, ...data } as Student);
        });

        resolve(students);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  // student
  async findMyHostel() {
    return new Promise<Hostel>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const student = new StudentService();
        const profile = await student.profile();

        if (!profile.hostelId)
          throw new Error("You have not applied to a hostel");
        const hostel = await this.findOne(profile.hostelId.id);
        resolve(hostel);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async apply(hostelId: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.user) throw new Error("You need to be logged in");
        const student = new StudentService();
        const profile = await student.profile();

        if (profile.hostelId)
          throw new Error("You have already applied for a hostel");

        const { noOfRooms, personsPerRoom, rooms } = await this.findOne(
          hostelId
        );
        const maxOccupants = noOfRooms * personsPerRoom;
        const totalOccupants = rooms.reduce((a, b) => a + b);

        if (maxOccupants === totalOccupants)
          throw new Error("This hostel is at capacity");

        // find the room with the least number of occupants
        let smallestRoomIndex = leastIndex(rooms);
        let posIndex = smallestRoomIndex;
        // all rooms are equally filled
        if (smallestRoomIndex === -1) {
          const nextIndex = nextRoom(rooms, personsPerRoom);
          if (nextIndex === -1) throw new Error("All rooms have been filled");

          // put student in room with index `nextIndex`
          posIndex = nextIndex;
        }

        // assign student to hostel
        await student.assignToHostel(hostelId, posIndex + 1);

        // update hostel information
        // update rooms
        let updatedRooms = rooms.map((room, index) =>
          index === posIndex ? room + 1 : room
        );
        const hostelRef = doc(this.db, COLLECTION.HOSTELS, hostelId);
        await updateDoc(hostelRef, { rooms: updatedRooms });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}

// returns the index of the smallest number in an array or -1 if all numbers are equal
function leastIndex(rooms: number[]) {
  let leastIndex = -1;
  for (let i = 1; i < rooms.length; i++) {
    const room = rooms[i];
    if (rooms[i - 1] > room) {
      leastIndex = i;
      break;
    } else if (room > rooms[i - 1]) {
      leastIndex = i - 1;
      break;
    }
  }

  return leastIndex;
}

// find the next room to put a student in. returns -1 if all rooms are filled
function nextRoom(rooms: number[], personsPerRoom: number) {
  let index = -1;
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    if (room != personsPerRoom) {
      index = i;
      break;
    }
  }

  return index;
}
