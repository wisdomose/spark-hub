import { useContext } from "react"
import { PotterContext } from "./store"

export default function usePotter() {
    const user = useContext(PotterContext);

    return user;
}