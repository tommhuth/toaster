import { create } from "zustand"

function getActions(get, set, actions) {
    return {
        complete() { 
            set({
                state: "complete"
            })
        },
        gameOver() {
            set({
                state: "gameover"
            })
        },
        addObject() {
            set({
                objects: get().objects + 1
            })
        },
        removeObject() {
            set({
                objects: Math.max(get().objects - 1, 0)
            })
        },
    }
}

function getInitState() {
    return {
        objects: 0,
        state: "active"
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