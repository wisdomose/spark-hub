import PotterService from "@/services/Potter";
import { Potter, User } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const PotterContext = createContext<{
  user: Potter | null;
  updateUser: (value: Potter | null) => void;
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

export default function PotterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<null | Potter>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const updateUser = (value: typeof user) => {
    setUser(value);
  };
  const logout = () => {
    setLoading(true)
    const auth = getAuth();
    auth.signOut();
  };
  const value = { user, loading, loggedIn, logout, updateUser };

  // fetch Potter profile, set login and loading status
  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        (async function () {
          const potter = new PotterService();
          await potter
            .profile()
            .then((res) => {
              setUser(res);
              setLoggedIn(true);
            })
            .catch((err) => {
              toast.error("Failed to fetch potter profile");
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
  }, []);

  return (
    <PotterContext.Provider value={value}>{children}</PotterContext.Provider>
  );
}
