import type { InstancedMesh } from "three"
import create from "zustand"
import { Tuple3 } from "../types"
import random from "@huth/random"
import { Stage, stages } from "./stages"
import Counter from "./Counter"

interface Instance {
    mesh: InstancedMesh;
    maxCount: number;
    index: Counter;
}

export enum InstanceName {
    BALLS = "balls",
    BOXES = "boxes",
    TABLES = "tables",
    CHAIR = "chair",
    SHELVES = "shelves",
    PLANTS = "plants",
    CABINETS = "cabinets",
    TABLE_CHAIRS = "table-chairs",
}


export interface Ball {
    velocity: Tuple3
    id: string
    position: Tuple3
}

export interface Box {
    size: Tuple3
    id: string
    position: Tuple3
    rotation: Tuple3
    dead: boolean;
}


export enum State {
    INTRO = "intro",
    LOADING = "loading",
    STAGE_SELECT = "stage select",
    PLAYING = "playing",
    GAME_OVER = "game over",
}

interface Store {
    instances: Record<string, Instance>
    stage: Stage
    state: State
    balls: Ball[]
    boxes: Box[]
    id: string
    player: {
        ballCount: number
        score: number,
        penalties: number,
        time: number
    }
}

const createDefaultStore = () => {
    return {
        instances: {},
        state: State.INTRO,
        stage: stages[0],
        balls: [],
        boxes: [],
        id: random.id(),
        player: {
            ballCount: 0,
            score: 0,
            penalties: 0,
            time: 0
        }
    }
}

const store = create<Store>(() => createDefaultStore())

const useStore = store

export function setState(state: State) {
    store.setState({
        state,
    })
} 

export function setPenalties(penalties: number) {
    store.setState({
        player: {
            ...store.getState().player,
            penalties,
        }
    })
}

export function reduceTime(amount = 1) {
    store.setState({
        player: {
            ...store.getState().player,
            time: Math.max(store.getState().player.time - amount, 0),
        }
    })
}

export function addPenalty() {
    store.setState({
        player: {
            ...store.getState().player,
            penalties: store.getState().player.penalties + 1,
        }
    })
}

export function setStage(stage: Stage) { 
    store.setState({
        balls: [],
        boxes: [],
        id: random.id(),
        stage,
    })
}

export function reset() {
    store.setState({
        balls: [], 
        boxes: [],
        id: random.id(),
        player: {
            ballCount: 0,
            score: 0,
            penalties: 0,
            time: 0
        }
    })
}

export function setInstance(name: string, mesh: InstancedMesh, maxCount: number) {
    store.setState({
        instances: {
            ...store.getState().instances,
            [name]: {
                mesh,
                maxCount,
                index: new Counter(maxCount)
            }
        }
    })
}

export function addBall(position: Tuple3, velocity: Tuple3) {
    let ballCount = store.getState().player.ballCount

    store.setState({
        player: {
            ...store.getState().player,
            ballCount: ballCount + 1,
        },
        balls: [
            ...store.getState().balls,
            {
                id: random.id(),
                position,
                velocity
            }
        ]
    })
}

export function removeBall(id: string) {
    store.setState({
        balls: store.getState().balls.filter(i => i.id !== id),
    })
}

export function score(id: string) {
    store.setState({
        boxes: [
            ...store.getState().boxes.filter(i => i.id !== id),
            {
                ...store.getState().boxes.find((i) => i.id === id) as Box,
                dead: true,
            }
        ]
    })
}

export function addBox(boxes: { position: Tuple3, size: Tuple3, rotation: Tuple3 }[]) {
    store.setState({
        boxes: [
            ...store.getState().boxes,
            ...boxes.map(i => {
                return {
                    id: random.id(),
                    dead: false,
                    ...i
                }
            })
        ]
    })
}

export { store, useStore }