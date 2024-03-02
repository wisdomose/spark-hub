import { ROLES, User } from "./types";

export type Bursar = User &  { role: ROLES.BURSAR;  };
