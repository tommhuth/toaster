import { stages } from "../data/stages"
import { State, useStore, setState, setStage } from "../data/store"
import Arrow from "./Arrow"

export default function SuccessMessage() {
    let state = useStore(i => i.state) 

    return (
        <div
            style={{
                position: "fixed",
                right: "18%",
                left: "18%",
                top: "18%",
                bottom: "18%", 
                flexDirection: "column",
                textAlign: "center",
                justifyContent: "center",
                border: "1.5em solid currentColor",
                display: state === State.GAME_OVER ? "flex" : "none",
                zIndex: 2, 
                gap: ".35em",
            }}
        >
            <h1
                style={{
                    fontSize: "9em",
                    textTransform: "uppercase",
                    fontWeight: 900,
                    marginBottom: ".25em",
                    lineHeight: 1,
                    fontFamily: "var(--font-sans)"
                }}
            >
                Wooo!
            </h1>
            <p
                style={{
                    fontSize: "4em", 
                }}
            >
                You knocked down all the things
            </p> 
            <button
                onClick={() => {
                    setState(State.INTRO)
                    setStage(stages[0])
                }}
                style={{
                    fontSize: "2.5em", 
                    display: "flex",
                    position: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                    bottom: "1em",
                    left: "50%",
                    transform: "translateX(-50%)",
                    gap: ".5em"
                }}
            >
                Okay <Arrow direction="right" />
            </button>
        </div>
    )
}