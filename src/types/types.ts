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
  MANAGER = "MANAGER",
}

enum COLLECTION {
  STUDENTS = "students",
  BURSAR = "bursar",
  MANAGER = "manager",
  POTTERS = "potters",
  HOSTELS = "hostels",
  COMPLAINTS = "complaints",
}

export { ROLES, COLLECTION };
