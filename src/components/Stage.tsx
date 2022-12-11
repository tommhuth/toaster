import Boxes from "./stage/Boxes"
import Cabinets from "./stage/Cabinets"
import Chairs from "./stage/Chairs"
import Plants from "./stage/Plants"
import Shelves from "./stage/Shelves"
import TableChairs from "./stage/TableChairs"
import Tables from "./stage/Tables"
import Ground from "./stage/Ground"
import { useEffect } from "react"
import { reduceTime, State, store, useStore } from "../data/store"

export default function Stage() {
    let {stage, state} =  useStore()

    useEffect(() => {    
        if (stage.settings.timelimit && state === State.PLAYING) {
            let iid
            let tick = () => { 
                if (store.getState().player.time > 0) {
                    reduceTime()
                } else {
                    clearInterval(iid)
                }
            }

            iid = setInterval(tick, 1000)

            return () => {
                clearInterval(iid)
            }
        }
    }, [stage, state])

    return (
        <>
            <Boxes />
            <Ground />
            <Tables />
            <TableChairs />
            <Shelves />
            <Chairs />
            <Cabinets />
            <Plants />
        </>
    )
}