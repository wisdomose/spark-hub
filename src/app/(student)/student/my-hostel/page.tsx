"use client";
import StudentDashboard from "@/components/UI/StudentDashboard";
import useStudent from "@/store/student/useStudent";
import { useEffect, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import { Hostel, Student } from "@/types";
import HostelService from "@/services/Hostel";
import StudentsTable from "@/components/UI/StudentsTable";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import moment from "moment";
import { FiSave } from "react-icons/fi";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

export default function MyHostel() {
  const { loading, user } = useStudent();
  const [hostel, setHostel] = useState<Hostel>();
  const myHostelFetcher = useFetcher<Hostel>(null);

  useEffect(() => {
    if (loading) return;
    const hostel = new HostelService();
    myHostelFetcher.wrapper(hostel.findMyHostel);
  }, [loading]);

  useEffect(() => {
    if (myHostelFetcher.error) {
      toast.error(myHostelFetcher.error);
    }
  }, [myHostelFetcher.error]);
  useEffect(() => {
    if (myHostelFetcher.data) {
      setHostel(myHostelFetcher.data);
    }
  }, [myHostelFetcher.data]);

  async function downloadPdf() {
    if (!hostel || !user) return;
    const PDFPage = <PDF hostel={hostel} user={user} />;
    try {
      await pdf(PDFPage)
        .toBlob()
        .then((res) => {
          saveAs(res, user.displayName + user.trackNo + ".pdf");
        });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  //   if (hostel && user) {
  //     const pdf = <PDF hostel={hostel} user={user} />;
  //     return <>{pdf}</>;
  //   }

  return (
    <StudentDashboard active="my-hostel">
      <main className="max-w-xl w-full mx-auto">
        {myHostelFetcher.loading ? (
          <div className="mt-5 flex items-center w-full justify-center flex-col gap-4">
            <Spinner />

            <p className="text-gray-700 text-sm">fetching hostel information</p>
          </div>
        ) : !hostel ? (
          <div className="text-gray-700 text-sm text-center mt-5">
            Failed to fetch hostel information
          </div>
        ) : hostel ? (
          <div>
            <div className="flex justify-end">
              <button
                className="flex gap-3 items-center justify-center px-3 py-2 border border-primary-dark text-primary-dark rounded"
                onClick={downloadPdf}
              >
                <FiSave />
                save as PDF
              </button>
            </div>
            {user && (
              <div id="pdf">
                <PDF hostel={hostel} user={user} />
              </div>
            )}
          </div>
        ) : null}
      </main>
    </StudentDashboard>
  );
}

function PDF({ hostel, user }: { hostel: Hostel; user: Student }) {
  //   Font.register({
  //     family: "poppins",
  //     src: "http://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf",
  //   });
  const styles = StyleSheet.create({
    page: {
      marin: "0px",
      //   fontFamily: "poppins",
      display: "flex",
      flexDirection: "column",
      padding: "20px",
    },
    entryWrapper: {
      display: "flex",
      flexDirection: "column",
      padding: "40px 0",
      gap: "0px",
      width: "100%",
      borderBottom: "1px solid rgb(229, 231, 235)",
    },
    entryRow: {
      display: "flex",
      flexDirection: "row",
      columnGap: "80px",
      rowGap: "20px",
      paddingTop: "20px",
    },
    entryText: {
      textTransform: "capitalize",
      width: "100%",
    },
    sectionHeading: {
      fontWeight: "bold",
      fontSize: "18px",
      //   lineHeight: "28px",
    },
  });

  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Hostel Information  */}
        <View style={styles.entryWrapper}>
          {/* <View> */}
          <Text style={styles.sectionHeading}>Hostel Information</Text>
          {/* </View> */}
          {/* name */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>name</Text>
            <Text style={styles.entryText}>{hostel.name}</Text>
          </View>
          {/* potter */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>potter</Text>
            <Text style={styles.entryText}>
              {hostel?.potter?.displayName ?? ""}
            </Text>
          </View>
        </View>

        {/* Guardian Information */}
        <View style={styles.entryWrapper}>
          <View>
            <Text style={styles.sectionHeading}>Guardian</Text>
          </View>
          {/* name */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>guardian</Text>
            <Text style={styles.entryText}>{user?.guardian ?? ""}</Text>
          </View>
          {/* phone number */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>guardianPhone</Text>
            <Text style={styles.entryText}>{user?.guardianPhone ?? ""}</Text>
          </View>
        </View>

        {/* Student Information */}
        <View style={styles.entryWrapper}>
          <View>
            <Text style={styles.sectionHeading}>Student Information</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>fullname</Text>
            <Text style={styles.entryText}>{user?.displayName ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>date of birth</Text>
            <Text style={styles.entryText}>
              {moment(user?.DOB).format("YYYY/MM/DD") ?? ""}
            </Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>gender</Text>
            <Text style={styles.entryText}>{user?.gender ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>email</Text>
            <Text style={styles.entryText}>{user?.email ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>phone number</Text>
            <Text style={styles.entryText}>{user?.phoneNo ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>track number</Text>
            <Text style={styles.entryText}>{user?.trackNo ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>department</Text>
            <Text style={styles.entryText}>{user?.dept ?? ""}</Text>
          </View>
          {/*  */}
          <View style={styles.entryRow}>
            <Text style={styles.entryText}>level</Text>
            <Text style={styles.entryText}>{user?.level ?? ""}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function Entry({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="capitalize">{label}</p>
      <div className="place-self-left">
        <p className="capitalize">{value}</p>
      </div>
    </>
  );
}
