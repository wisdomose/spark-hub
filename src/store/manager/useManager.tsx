import { useContext } from "react"
import { ManagerContext } from "./store";

export default function useManager() {
    const user = useContext(ManagerContext);

    return user;
}