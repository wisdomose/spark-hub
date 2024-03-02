export interface User {
  id:string;
  userId: string
  role:ROLES;
  displayName:string;
  email:string;
  profilePic?:string;
}

enum ROLES {
  STUDENT = "STUDENT",
  POTTER = "POTTER",
  BURSAR = "BURSAR",
}

enum COLLECTION {
  STUDENTS = "students",
  BURSAR = "bursar",
  POTTERS = "potters",
  HOSTELS = "hostels",
  COMPLAINTS = "complaints",
}

export { ROLES, COLLECTION };
