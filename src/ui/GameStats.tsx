import { setState, State, useStore } from "../data/store"
import Arrow from "./Arrow" 

import "./GameStats.scss"

export default function GameStats() {
    let state = useStore(i => i.state)
    let player = useStore(i => i.player)
    let stage = useStore(i => i.stage)
    let boxes = useStore(i => i.boxes)
    let statNames = ["Attempts", "Boxes", "Score"]
    let stats = [
        player.ballCount,
        <>{boxes.filter(i => i.dead).length} / {boxes.length}</>,
        (boxes.filter(i => i.dead).length * 150 - player.penalties * 750).toLocaleString("en")
    ]

    return (
        <div
            style={{
                display: state === State.PLAYING ? "flex" : "none",
            }}
            className="game-stats"
        > 
            <button
                onClick={() => {
                    setState(State.INTRO)
                }}
                className="game-stats__back"
                style={{
                }}
            >
                <Arrow direction="left" />
                {stage.title}
            </button>

            {stats.map((i, index) => {
                return (
                    <p 
                        className="game-stats__stat"
                        key={statNames[index]}
                    >
                        <em>
                            {i}
                        </em>

                        {statNames[index].toLocaleLowerCase()}
                    </p>
                )
            })}
        </div>
    )
}