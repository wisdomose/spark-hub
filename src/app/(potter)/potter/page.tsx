"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import useFetcher from "@/hooks/useFetcher";
import useInput from "@/hooks/useInput";
import UserService, { LoginResponse } from "@/services/User";
import usePotter from "@/store/potter/usePotter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function PotterLoginPage() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>();
  const [email, emailOpts] = useInput("");
  const [password, passwordOpts] = useInput("");
  const router = useRouter();
  const { loading: profileLoading, loggedIn } = usePotter();

  const login = async () => {
    const userService = new UserService();
    await wrapper(() => userService.login({ email, password }));
  };

  useEffect(() => {
    if (!profileLoading && loggedIn) {
      router.replace("/potter/hostel");
    }
  }, [profileLoading, loggedIn]);

  useEffect(() => {
    if (data) {
      router.replace("/potter/hostel");
    }
  }, [data]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (profileLoading) return <Loader />;
  if (profileLoading && loggedIn) return <Loader />;

  return (
    <main className="max-w-xl mx-auto pt-10 pb-20 px-10">
      <h1 className="text-2xl font-medium text-center">Potter Login</h1>

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
          Not a potter?
          <br />
          <br />
          <Link href="/bursar" className="text-primary-base">
            sign in as bursar
          </Link>
          <br />
          or
          <br />
          <Link href="/" className="text-primary-base">
            sign in as student
          </Link>
        </p>
      </form>
    </main>
  );
}
