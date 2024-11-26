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
     apiKey: "AIzaSyAJS0-8QpfmoV7GBWAM6zFBbR3gsNSiaCM",
  authDomain: "hostel-5d49b.firebaseapp.com",
  projectId: "hostel-5d49b",
  storageBucket: "hostel-5d49b.firebasestorage.app",
  messagingSenderId: "127910766264",
  appId: "1:127910766264:web:7bdc561516216f86d1364d"
  };

  useEffect(() => {
    initializeApp(firebaseConfig)

    if (process.env.NODE_ENV === "development") {
      const storage = getStorage();
      const auth = getAuth();
      const db = getFirestore();
      connectStorageEmulator(storage, "localhost", 9199);
      connectFirestoreEmulator(db, "localhost", 8080);
      connectAuthEmulator(auth, "http://localhost:9099");
    }
    setInit(true);
  }, []);

  if (!init) return null;
  return <>{children}</>;
}
