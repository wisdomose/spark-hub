import { ROLES, User } from "./types";

export type Manager = User &  { role: ROLES.MANAGER;  };
