import { stages } from "../data/stages"
import { setStage, setState, State, useStore } from "../data/store"

function Arrow({ direction = "right" }) {
    return (
        <svg viewBox="0 0 100 50" style={{ overflow: "visible", width: ".75em", display: "block" }}>
            <line x1={0} x2={100} y1={25} y2={25} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />

            <line x1={direction == "right" ? 75 : 25} x2={direction == "right" ? 100 : 0} y1={50 * .1} y2={25} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
            <line x1={direction == "right" ? 75 : 25} x2={direction == "right" ? 100 : 0} y1={50 * .9} y2={25} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
        </svg>
    )
}

export default function UI() {
    let state = useStore(i => i.state)
    let player = useStore(i => i.player)
    let boxes = useStore(i => i.boxes)
    let stage = useStore(i => i.stage)
    let statNames = ["Attempts", "Boxes", "Penalties", "Score"]
    let stats = [player.ballCount, <>{boxes.filter(i => i.dead).length} of {boxes.length}</>, player.penalties, boxes.filter(i => i.dead).length - player.penalties * 10]

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
                    zIndex: 998,
                    backgroundImage: "linear-gradient(to top left, black, white )",
                    //mixBlendMode: "overlay",
                    opacity: .2
                }}
            />
            <div
                style={{
                    position: "fixed",
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
                    onClick={() => setState(State.INTRO)}
                    style={{ 
                        display: "inline-flex",
                        gap: ".5em",
                        alignItems: "center", 
                    }}
                >
                    <Arrow direction="left" /> Untitled furniture game
                </button>
            </div>
            <ul
                style={{
                    position: "fixed",
                    right: "3em",
                    bottom: "2.25em",
                    overflow: "hidden",
                    display: state === State.PLAYING ? "flex" : "none",
                    zIndex: 1000,
                    fontSize: "2em",
                    gap: "1.5em",
                }}
            >
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
            <div
                style={{
                    position: "fixed",
                    left: "2em",
                    top: "2em",
                    bottom: "2em",
                    right: "2em",
                    zIndex: 999,
                    pointerEvents: "none",
                    border: "1em solid white",
                    boxSizing: "border-box",
                    transition: "all 1s",
                    display: [State.STAGE_SELECT, State.INTRO].includes(state) ? "block" : "none",
                }}
            />
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    overflow: "hidden",
                    display: [State.STAGE_SELECT, State.INTRO].includes(state) ? "block" : "none",
                    zIndex: 1000,
                }}
                onClick={() => setState(State.PLAYING)}
            >
                <div
                    style={{
                        overflow: "auto",
                        zIndex: 1000,
                        width: "calc(100% + 4em)",
                        height: "100%",
                        scrollSnapType: "y mandatory",
                    }}
                >
                    <div
                        style={{
                            height: "100vh",
                            display: "flex",
                            boxSizing: "border-box",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "10%",
                            scrollSnapStop: "always",
                            scrollSnapAlign: "start",
                            position: "relative",
                            color: "white",
                        }}
                    >

                        <h1 style={{ color: "white", fontSize: "12em", fontWeight: 900, lineHeight: .9, textTransform: "uppercase", fontFamily: "Roboto" }}>
                            Untitled furniture <br /> game
                        </h1>
                    </div>

                    <div
                        style={{
                            position: "fixed",
                            left: "50%",
                            bottom: "2.5em",
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
            </div>
        </>
    )
}