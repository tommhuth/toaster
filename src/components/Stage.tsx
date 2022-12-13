import Boxes from "./stage/Boxes"
import Cabinets from "./stage/Cabinets"
import Chairs from "./stage/Chairs"
import Plants from "./stage/Plants"
import Shelves from "./stage/Shelves"
import TableChairs from "./stage/TableChairs"
import Tables from "./stage/Tables"
import Ground from "./stage/Ground"
import { useEffect } from "react"
import { setState, State, useStore } from "../data/store"

export default function Stage() {
    let state = useStore(i => i.state)
    let boxes = useStore(i => i.boxes)

    useEffect(() => {
        let { boxes } = useStore.getState()
        let gameOver = boxes.filter(i => i.dead).length === boxes.length

        if (gameOver && state === State.PLAYING) {
            setState(State.GAME_OVER)
        }
    }, [state, boxes])

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