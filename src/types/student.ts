import { DocumentData, DocumentReference } from "firebase/firestore";
import { ROLES, User } from "./types";
import { Hostel } from ".";

export type Student = User & {
  approved: boolean;
  trackNo: string;
  role: ROLES.STUDENT;
  hostelId?: DocumentReference<DocumentData, DocumentData>;
  hostel?: Hostel;
  room?: number;
  gender: string;
  DOB: Date;
  dept: string;
  level: string;
  guardian: string;
  phoneNo: string;
  guardianPhone: string;
};
