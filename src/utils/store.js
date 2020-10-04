import { create } from "zustand"
import State from "./const/State"
import maps from "./maps"

function getActions(get, set, actions) {
    return {
        play() { 
            set({
                state: State.PLAYING
            })
        },
        ready() {
            set({
                state: State.READY
            })
        },
        reset() {
            set({
                ...getInitState()
            })
        },
        end() {
            set({
                state: State.GAME_OVER
            })
        },
        success() {
            LocalStorage.set(get().map.id, true)

            set({
                state: State.SUCCESS
            })
        },
        loadMap(map, state = State.PREPARING) {
            set({
                map,
                state,
                spaces: [],
                score: 0,
                balls: 0,
                attempts: get().attempts + 1
            })
        },
        reloadMap() {
            console.log("reload map")
            set({
                state: State.PLAYING,
                spaces: [],
                score: 0,
                attempts: get().attempts + 1
            })
        },
        progress() {
            let { map } = get()
            let next = maps.findIndex(i => i.id === map.id) + 1
            let { loadMap, reset } = actions()

            if (next < maps.length) {
                loadMap(maps[next], State.PLAYING)
            } else {
                reset()
            }

        },
        createSpaces(...spaces) {
            set({ spaces: [...get().spaces, ...spaces] })
        },
        setObjectCount(count) {
            set({
                objects: count
            })
        },
        setBallsCount(count) {
            set({
                balls: count
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
        balls: 0,
        score: 0,
        spaces: [],
        state: State.INTRO,
        map: null,
        attempts: 0,
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