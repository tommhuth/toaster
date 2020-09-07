import { useEffect } from "react"
import { useThree } from "react-three-fiber"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

export default function Camera() {
    let { camera } = useThree()
    let state = useStore(i => i.data.state)


    useEffect(() => {

        switch (state) {
            case State.INTRO:
                camera.position.set(10, 10, 10)
                camera.lookAt(0, 0, 0)
                camera.position.x = 15
                camera.position.z = 5
                break 
            case State.PLAYING:
                camera.position.set(10, 10, 10)
                break 
        }
    }, [state])

    useEffect(() => {

    }, [])

    return null
}