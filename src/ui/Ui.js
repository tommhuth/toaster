import React from "react"
import Only from "../components/Only"
import MapSelect from "./MapSelect"
import PlayStats from "./PlayStats"
import Cursor from "./Cursor"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

export default function Ui() {
    let state = useStore(i => i.data.state)

    return (
        <>
            <Only if={[State.INTRO, State.READY, State.PREPARING].includes(state)}>
                <MapSelect />
            </Only>
            <Only if={state === State.GAME_OVER}>
                <h1 className="h1">
                    Game
                    <span>over</span>
                </h1>
            </Only>
            <Only if={state === State.SUCCESS}>
                <h1 className="h1 actionable" data-cursor-icon="arrow-right">
                    Yay
                </h1> 
            </Only>
            <Only if={state === State.PLAYING}>
                <PlayStats />
            </Only>

            <Cursor />
        </>
    )
}