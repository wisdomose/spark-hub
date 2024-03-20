import ManagerService from "@/services/Manager";
import { Manager } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const ManagerContext = createContext<{
  user: Manager | null;
  updateUser: (value: Manager | null) => void;
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

export default function ManagerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<null | Manager>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();

  const updateUser = (value: typeof user) => {
    setUser(value);
  };
  const logout = async () => {
    setLoading(true);
    await auth.signOut();
  };
  const value = { user, loading, loggedIn, logout, updateUser };

  // fetch Manager profile, set login and loading status
  useEffect(() => {
    const a = onAuthStateChanged(auth, (authUser) => {
      (async function () {
        if (authUser) {
          const manager = new ManagerService();
          await manager
            .profile()
            .then((res) => {
              setUser(res);
              setLoggedIn(true);
            })
            .catch((err) => {
              // toast.error("Failed to fetch manager profile");
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setLoggedIn(false);
          setLoading(false);
        }
      })();
    });

    return () => {
      a();
    };
  }, []);

  return (
    <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>
  );
}
