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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(200).send("API up and running");
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
              credential: admin.credential.cert("./public/service.json"),
            },
            "admin"
          );

    const firebaseConfig = {
      apiKey: "AIzaSyCviR8p6PChRKE3kRysmQCWameWUpDKrz8",
      authDomain: "spark-hub-ed898.firebaseapp.com",
      projectId: "spark-hub-ed898",
      storageBucket: "spark-hub-ed898.appspot.com",
      messagingSenderId: "287491742340",
      appId: "1:287491742340:web:863951388483c041e380d1",
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
