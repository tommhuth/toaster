import { stages } from "../data/stages"
import { reset, setStage, setState, State, useStore } from "../data/store"
import Arrow from "./Arrow"

export default function Intro() {
    let state = useStore(i => i.state)
    let stage = useStore(i => i.stage)
    let player = useStore(i => i.player)

    return (
        <>
            <div
                style={{
                    display: state === State.INTRO ? "flex" : "none",
                    boxSizing: "border-box",
                    flexDirection: "column",
                    justifyContent: "center",
                    left: "3em",
                    top: "3em",
                    right: "3em",
                    bottom: "3em",
                    zIndex: 2,
                    cursor: "pointer",
                    border: "1.5em solid white",
                    position: "fixed", 
                }}
                onClick={() => {
                    setState(State.PLAYING)

                    if (player.ballCount > 0) {
                        reset()
                    }
                }}
            >
                <h1
                    style={{ 
                        fontSize: "clamp(2em, 13vw, 14em)",
                        fontWeight: 900,
                        lineHeight: .9,
                        marginLeft: "5%",
                        textTransform: "uppercase",
                        fontFamily: "Roboto"
                    }}
                >
                    Untitled <br /> furniture <br /> game
                </h1>

                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "1em",
                        translate: " -50% 0",
                        lineHeight: 1,
                        fontSize: "2.5em",
                        alignItems: "center",
                        gap: ".5em",
                        display: "flex",
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            let index = stages.findIndex(i => i === stage)

                            setStage(stages[index === 0 ? stages.length - 1 : index - 1])
                        }}
                        style={{ border: "1rem solid transparent" }}
                    >
                        <Arrow direction="left" />
                    </button>

                    <span>{stage.title}</span>

                    <button
                        style={{ border: "1rem solid transparent" }}
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