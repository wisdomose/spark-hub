"use client";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import useFetcher from "@/hooks/useFetcher";
import BursarService from "@/services/Bursar";
import ManagerService from "@/services/Manager";
import StudentService from "@/services/Student";
import { Student } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HomesPage() {
  const {
    wrapper,
    loading,
    data: createData,
    error,
  } = useFetcher<Student | null>(null);
  const [data, setData] = useState({
    displayName: "",
    email: "",
    password: "",
    trackNo: "",
    gender: "",
    DOB: new Date(),
    dept: "",
    level: "",
    guardian: "",
    phoneNo: "",
    guardianPhone: "",
  });

  const updateData =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement>) => {
      setData((state) => {
        const newState = {
          ...state,
          [key]: e.target.value,
        };
        return { ...newState };
      });
    };

  const router = useRouter();

  const signup = async () => {
    const {
      displayName,
      email,
      password,
      trackNo,
      gender,
      DOB,
      dept,
      level,
      guardian,
      phoneNo,
      guardianPhone,
    } = data;
    const disabled =
      !displayName ||
      !email ||
      !password ||
      !trackNo ||
      !gender ||
      !DOB ||
      !dept ||
      !level ||
      !guardian ||
      !phoneNo ||
      !guardianPhone;

    if (disabled) {
      toast.error("Some fields are missing");
      return;
    }
    const studentService = new StudentService();
    await wrapper(() => studentService.signUp({ ...data }));
  };

  // useEffect(() => {
  //   if (!profileLoading && loggedIn) {
  //     router.replace("/student/dashboard");
  //   }
  // }, [profileLoading, loggedIn]);

  useEffect(() => {
    const bursar = new BursarService();
    const manager = new ManagerService();
    Promise.all([bursar.init(), manager.init()]);
  }, []);

  useEffect(() => {
    if (createData) {
      router.push("/login");
      toast.success("Signup complete");
    }
  }, [createData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // if (profileLoading) return <Loader />;
  // if (profileLoading && loggedIn) return <Loader />;

  return (
    <main className="max-w-xl mx-auto pt-10 pb-20 px-10">
      <h1 className="text-2xl font-medium text-center capitalize">
        Student Signup
      </h1>

      <form
        className="flex flex-col gap-5 mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          signup();
        }}
      >
        <Input
          required
          value={data.email}
          onChange={updateData("email")}
          label="Email"
          type="email"
          id="email"
          placeholder="johndoe@email.com"
        />
        <Input
          required
          value={data.phoneNo}
          onChange={updateData("phoneNo")}
          label="Phone number"
          type="text"
          id="tel"
        />
        <Input
          required
          value={data.password}
          onChange={updateData("password")}
          label="Password"
          type="password"
          id="new-password"
          placeholder="passsword"
        />
        <Input
          required
          value={data.displayName}
          onChange={updateData("displayName")}
          label="Fullname"
          type="text"
          id="Fullname"
          placeholder="John Doe"
        />
        <Input
          required
          value={data.trackNo}
          onChange={updateData("trackNo")}
          label="Track number"
          type="text"
          id="track-number"
        />
        <Checkbox
          label="Gender"
          options={["male", "female"]}
          checked={[data.gender]}
          name="gender"
          required
          onChange={(e) => {
            setData((s) => ({ ...s, gender: e }));
          }}
        />
        <Input
          required
          // @ts-ignore
          value={data.DOB}
          onChange={updateData("DOB")}
          label="Date of birth"
          type="date"
          id="dob"
        />
        <Input
          required
          value={data.dept}
          onChange={updateData("dept")}
          label="Department"
          type="text"
          id="department"
        />
        <Checkbox
          label="Level"
          options={["100", "200", "300", "400", "500", "600", "700"]}
          checked={[data.level]}
          name="level"
          required
          onChange={(e) => {
            setData((s) => ({ ...s, level: e }));
          }}
        />
        <Input
          required
          value={data.guardian}
          onChange={updateData("guardian")}
          label="Name of guardian"
          type="text"
          id="guardian-name"
        />
        <Input
          required
          value={data.guardianPhone}
          onChange={updateData("guardianPhone")}
          label="Guardian's phone number"
          type="text"
          id="guardian-phone"
        />
        {/* <Input
          required
          value={data.trackNo}
          onChange={updateData("trackNo")}
          label="Track number"
          type="text"
          id="track-number"
        /> */}

        <Button type="submit" label="Sign In" loading={loading} block />
      </form>

      <p className="text-center mt-5">
        Already have an account?{" "}
        <Link
          href="/login/"
          className="text-primary-base"
        >
          Login here
        </Link>
      </p>
    </main>
  );
}
