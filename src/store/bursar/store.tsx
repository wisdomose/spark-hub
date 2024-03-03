import BursarService from "@/services/Bursar";
import { Bursar, User } from "@/types";
import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const BursarContext = createContext<{
  user: Bursar | null;
  updateUser: (value: Bursar | null) => void;
  logout(): void;
  loading: Boolean;
  loggedIn: Boolean;
}>({
  user: null,
  loading: true,
  loggedIn: false,
  updateUser: (value) => {},
  logout: () => {},
});

export default function BursarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<null | Bursar>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const updateUser = (value: typeof user) => {
    setUser(value);
  };
  const logout = async () => {
    console.log("called");
    setLoading(true);
    const auth = getAuth();
    await auth.signOut();
  };
  const value = { user, loading, loggedIn, logout, updateUser };

  // fetch Bursar profile, set login and loading status
  useEffect(() => {
    const auth = getAuth();
    const app = getApp();

    if (app) {
      const a = onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (user) {
          (async function () {
            const bursar = new BursarService();
            await bursar
              .profile()
              .then((res) => {
                setUser(res);
                setLoggedIn(true);
              })
              .catch((err) => {
                toast.error("Failed to fetch bursar profile");
              })
              .finally(() => {
                setLoading(false);
              });
          })();
        } else {
          setLoggedIn(false);
          setLoading(false);
        }
      });

      return () => a();
    }
  }, []);

  return (
    <BursarContext.Provider value={value}>{children}</BursarContext.Provider>
  );
}
