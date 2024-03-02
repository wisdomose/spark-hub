import { DocumentData, DocumentReference } from "firebase/firestore";
import { Potter } from ".";

export type Hostel = {
  id: string;
  name: string;
  noOfRooms: number;
  personsPerRoom: number;
  rooms: number[];
  potterId: DocumentReference<DocumentData, DocumentData>;
  potter?: Potter;
};
