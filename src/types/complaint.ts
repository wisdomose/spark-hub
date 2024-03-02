import { serverTimestamp } from "firebase/firestore";

export type Complaint = {
  heading: string;
  complaint: string;
  id: string;
  response: string;
  resolved: boolean;
  hostelId: string;
  studentId: string;
  createdAt: { seconds: number; nanoseconds: number };
};
