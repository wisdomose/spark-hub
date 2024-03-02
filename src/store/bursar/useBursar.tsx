import { useContext } from "react"
import { BursarContext } from "./store"

export default function useBursar() {
    const user = useContext(BursarContext);

    return user;
}