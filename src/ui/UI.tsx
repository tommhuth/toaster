import { State, useStore } from "../data/store"
import GameStats from "./GameStats"
import Intro from "./Intro"
import SuccessMessage from "./SuccessMessage"

export default function UI() {
    let state = useStore(i => i.state)
    let panning = useStore(i => i.panning)

    return (
        <> 
            <div
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    top: 0,
                    pointerEvents: "none",
                    bottom: 0,
                    zIndex: 10,
                    backgroundImage: "linear-gradient(to top left, black 30%, white)",
                    opacity: .3,
                    mixBlendMode: "screen"
                }}
            /> 
            <Intro />
            <GameStats />
            <SuccessMessage />
            {state === State.PLAYING && <button className={"panner " + (panning ? "panner--active" : "")} />}
        </>
    )
}