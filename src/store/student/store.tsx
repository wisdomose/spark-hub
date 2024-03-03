import StudentService from "@/services/Student";
import { Student, User } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StudentContext = createContext<{
  user: Student | null;
  updateUser: (value: Student | null) => void;
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

export default function StudentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<null | Student>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const updateUser = (value: typeof user) => {
    setUser(value);
  };
  const logout = () => {
    setLoading(true);
    const auth = getAuth();
    auth.signOut();
  };
  const value = { user, loading, loggedIn, logout, updateUser };

  // fetch Student profile, set login and loading status
  useEffect(() => {
    const auth = getAuth();

    const a = onAuthStateChanged(auth, (user) => {
      console.log(user, "student");

      if (user) {
        (async function () {
          const student = new StudentService();
          await student
            .profile()
            .then((res) => {
              setUser(res);
              setLoggedIn(true);
            })
            .catch((err) => {
              toast.error("Failed to fetch student profile");
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
  }, []);

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}
