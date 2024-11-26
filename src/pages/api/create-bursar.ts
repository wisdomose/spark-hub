import { COLLECTION, ROLES } from "@/types/types";
import * as admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(200).send("API up and running");
    const serviceAccountPath = path.resolve("./public/service.json");
    const {
      email = "bursar@gmail.com",
      password = "123456",
      displayName = "Bursar name",
    } = req.body;
    const admin2 =
      admin.apps.length > 0
        ? admin.app("admin")
        : admin.initializeApp(
            {
              // TODO: don't put this in production level code
              credential: admin.credential.cert(serviceAccountPath),
            },
            "admin"
          );

    const firebaseConfig = {
        apiKey: "AIzaSyAJS0-8QpfmoV7GBWAM6zFBbR3gsNSiaCM",
  authDomain: "hostel-5d49b.firebaseapp.com",
  projectId: "hostel-5d49b",
  storageBucket: "hostel-5d49b.firebasestorage.app",
  messagingSenderId: "127910766264",
  appId: "1:127910766264:web:7bdc561516216f86d1364d"
    };

    initializeClientApp(firebaseConfig);
    const db = getFirestore();

    try {
      if (process.env.NODE_ENV === "development") {
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        // connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      email,
      password,
      displayName,
      emailVerified: false,
      disabled: false,
    });

    const doc = {
      userId: userRecord.uid,
      role: ROLES["BURSAR"],
      email,
      displayName,
      profilePic: null,
      timestamp: serverTimestamp(),
    };

    const result = await addDoc(collection(db, COLLECTION.BURSAR), doc);

    res.status(200).json(doc);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
}
