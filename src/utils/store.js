import { create } from "zustand"
import State from "./const/State"

function getActions(get, set) {
    return {
        ready() {
            set({
                state: State.READY
            })
        },
        end() {
            set({
                state: State.GAME_OVER
            })
        },
        useMap(map) {
            set({
                map,
                state: State.PREPARING,
                spaces: [],
                score: 0,
                attempts: get().attempts + 1
            })
        },
        createSpaces(...spaces) {
            set({ spaces: [...get().spaces, ...spaces] })
        },
        setObjectCount(count) {
            set({
                objects: count
            })
        },
        score() {
            set({
                score: get().score + 1, 
            })
        },
        startLaunch(position) {
            set({
                ...get(),
                launcher: {
                    ...get().launcher,
                    active: true,
                    start: position
                }
            })
        },
        moveLaunch(position) {
            set({
                ...get(),
                launcher: {
                    ...get().launcher,
                    end: position
                }
            })
        },
        stopLaunch() { 
            set({
                ...get(),
                launcher: {
                    ...get().launcher,
                    active: false,
                }
            })
        }
    }
}

function getInitState() {
    return {
        objects: 0,
        score: 0,
        spaces: [],
        state: "active",
        map: null,
        attempts:0,
        launcher: {
            active: false,
            start: [0, 0],
            end: [0, 0]
        }
    }
}

const [useStore, api] = create((set, get) => {
    return {
        data: getInitState(),
        actions: getActions(
            () => get().data,
            (data) => {
                set({
                    data: {
                        ...get().data,
                        ...data,
                    },
                })
            },
            () => get().actions
        ),
    }
})

export { useStore, api }