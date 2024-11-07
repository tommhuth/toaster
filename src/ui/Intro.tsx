import { stages } from "../data/stages"
import { reset, setStage, setState, State, useStore } from "../data/store"
import Arrow from "./Arrow"

import "./intro.scss"

export default function Intro() {
    let state = useStore(i => i.state)
    let stage = useStore(i => i.stage)
    let player = useStore(i => i.player)

    return (
        <>
            <div
                className="intro"
                style={{
                    display: state === State.INTRO ? "flex" : "none",
                }}
                onClick={() => {
                    setState(State.PLAYING)

                    if (player.ballCount > 0) {
                        reset()
                    }
                }}
            >
                <h1 className="intro__title">
                    Untitled <br /> furniture <br /> game
                </h1>

                <div className="intro__stage">
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            let index = stages.findIndex(i => i === stage)

                            setStage(stages[index === 0 ? stages.length - 1 : index - 1])
                        }} 
                    >
                        <Arrow direction="left" />
                    </button>

                    <strong>{stage.title}</strong>

                    <button 
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            let index = stages.findIndex(i => i === stage)

                            setStage(stages[(index + 1) % stages.length])
                        }}
                    >
                        <Arrow />
                    </button>
                </div>
            </div>
        </>
    )
}