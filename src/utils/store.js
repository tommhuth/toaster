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
                spaces: []
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
        reduceObjectCount() {
            set({
                objects: Math.max(get().objects - 1, 0)
            })
        },
    }
}

function getInitState() {
    return {
        objects: 0,
        spaces: [],
        state: "active",
        map: null
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