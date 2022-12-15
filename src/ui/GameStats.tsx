import { setState, State, useStore } from "../data/store"
import Arrow from "./Arrow" 

export default function GameStats() {
    let state = useStore(i => i.state)
    let player = useStore(i => i.player)
    let stage = useStore(i => i.stage)
    let boxes = useStore(i => i.boxes)
    let statNames = ["Attempts", "Boxes", "Score"]
    let stats = [
        player.ballCount,
        <>{boxes.filter(i => i.dead).length} of {boxes.length}</>,
        (boxes.filter(i => i.dead).length * 150 - player.penalties * 750).toLocaleString("en")
    ]

    return (
        <ul
            style={{
                position: "fixed",
                right: "3em",
                left: "3em",
                bottom: "2.25em",
                overflow: "hidden",
                display: state === State.PLAYING ? "flex" : "none",
                zIndex: 1000,
                fontSize: "2em",
                gap: "1.5em",
            }}
        > 
            <button
                onClick={() => {
                    setState(State.INTRO)
                }}
                style={{
                    display: "inline-flex",
                    gap: ".5em",
                    fontSize: "1.25em",
                    alignItems: "center",
                    textAlign: "center",
                    marginLeft: 0,
                    marginRight: "auto",
                }}
            >
                <Arrow direction="left" />
                {stage.title}
            </button>

            {stats.map((i, index) => {
                return (
                    <li
                        style={{
                            display: "flex",
                            gap: ".35em",
                        }}
                        key={statNames[index]}
                    >
                        <em style={{ marginLeft: "auto", fontWeight: "bold", fontStyle: "italic", fontFamily: "var(--font-sans)" }}>
                            {i}
                        </em>
                        {statNames[index].toLocaleLowerCase()}
                    </li>
                )
            })}
        </ul>
    )
}