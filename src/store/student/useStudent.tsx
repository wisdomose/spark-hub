import { useContext } from "react"
import { StudentContext } from "./store"

export default function useStudent() {
    const user = useContext(StudentContext);

    return user;
}