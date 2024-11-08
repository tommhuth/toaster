import { setState, State, useStore } from "../data/store"
import Arrow from "./Arrow" 

import "./GameStats.scss"

export default function GameStats() {
    let state = useStore(i => i.state)
    let player = useStore(i => i.player) 
    let boxes = useStore(i => i.boxes)
    let statNames = ["Attempts", "Boxes", "Score"]
    let stats = [
        player.ballCount,
        <>{boxes.filter(i => i.dead).length} / {boxes.length}</>,
        (boxes.filter(i => i.dead).length * 100 - player.penalties * 1000).toLocaleString("en")
    ]

    return (
        <section
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
                <span className="visually-hidden">Back to menu</span>
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
        </section>
    )
}