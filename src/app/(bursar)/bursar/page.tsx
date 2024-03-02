"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import useFetcher from "@/hooks/useFetcher";
import useInput from "@/hooks/useInput";
import BursarService from "@/services/Bursar";
import UserService, { LoginResponse } from "@/services/User";
import useBursar from "@/store/bursar/useBursar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function BursarLoginPage() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>();
  const [email, emailOpts] = useInput("");
  const [password, passwordOpts] = useInput("");
  const router = useRouter();
  const { loading: profileLoading, loggedIn } = useBursar();

  const login = async () => {
    const userService = new UserService();
    await wrapper(() => userService.login({ email, password }));
  };

  // init bursar
  useEffect(() => {
    const bursar = new BursarService();
    bursar.init();
  }, []);

  useEffect(() => {
    if (!profileLoading && loggedIn) {
      router.replace("/bursar/dashboard");
    }
  }, [profileLoading, loggedIn]);

  useEffect(() => {
    if (data) {
      router.replace("/bursar/dashboard");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // if (profileLoading || loggedIn) return null;
  if (profileLoading) return <Loader />;
  if (profileLoading && !loggedIn) return <Loader />;

  return (
    <main className="max-w-xl mx-auto pt-10 pb-20 px-10">
      <h1 className="text-2xl font-medium text-center">Bursar Login</h1>

      <form
        className="flex flex-col gap-5 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <Input
          required
          {...emailOpts}
          label="Email"
          type="email"
          id="email"
          placeholder="johndoe@email.com"
        />
        <Input
          required
          {...passwordOpts}
          label="Password"
          type="password"
          id="password"
          placeholder="passsword"
        />

        <Button
          type="submit"
          label="Sign In"
          loading={loading || !!data}
          block
        />

        <p className="text-center mt-5">
          Not a bursar?
          <br />
          <br />
          <Link href="/" className="text-primary-base">
            sign in as student
          </Link>
          <br />
          or
          <br />
          <Link href="/potter/" className="text-primary-base">
            sign in as potter
          </Link>
        </p>
      </form>
    </main>
  );
}
