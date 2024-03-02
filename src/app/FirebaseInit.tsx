"use client";

import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

export default function FirebaseInit({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [init, setInit] = useState(false);
  const firebaseConfig = {
    apiKey: "AIzaSyCviR8p6PChRKE3kRysmQCWameWUpDKrz8",
    authDomain: "spark-hub-ed898.firebaseapp.com",
    projectId: "spark-hub-ed898",
    storageBucket: "spark-hub-ed898.appspot.com",
    messagingSenderId: "287491742340",
    appId: "1:287491742340:web:863951388483c041e380d1",
  };

  useEffect(() => {
    initializeApp(firebaseConfig);
    const storage = getStorage();
    const auth = getAuth();
    const db = getFirestore();

    if (process.env.NODE_ENV === "development") {
      connectStorageEmulator(storage, "localhost", 9199);
      connectFirestoreEmulator(db, "localhost", 8080);
      connectAuthEmulator(auth, "http://localhost:9099");
    }
    setInit(true);
  }, []);

  if (!init) return null;
  return <>{children}</>;
}
