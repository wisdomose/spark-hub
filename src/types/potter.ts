import { Hostel } from ".";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { ROLES, User } from "./types";

export type Potter = User & {
  role: ROLES.POTTER;
  hostelId: DocumentReference<DocumentData, DocumentData>;
  hostel: Hostel;
};
