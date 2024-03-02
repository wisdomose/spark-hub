import { DocumentData, DocumentReference } from "firebase/firestore";
import { ROLES, User } from "./types";
import { Hostel } from ".";

export type Student = User & {
  matricNo: string;
  role: ROLES.STUDENT;
  hostelId?: DocumentReference<DocumentData, DocumentData>;
  hostel?: Hostel;
  room?: number;
};
