import { useEffect, useRef, useLayoutEffect } from "react"
import { useThree, useFrame } from "react-three-fiber"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

export default function Camera() {
    let { camera } = useThree()
    let state = useStore(i => i.data.state)
    let map = useStore(i => i.data.map)
    let target = useRef([10, 10, 10])

    useLayoutEffect(() => {
        camera.position.set(...target.current)
        camera.lookAt(0, 0, 0)
    }, [])

    useFrame(() => {
        if (map) {
            if ([State.PLAYING, State.GAME_OVER, State.SUCCESS].includes(state)) {
                target.current = map.camera.playing
            } else {
                target.current = map.camera.preplaying
            }
        }
    }, [map, state])

    useFrame(() => {
        camera.position.x += (target.current[0] - camera.position.x) * .075
        camera.position.y += (target.current[1] - camera.position.y) * .075
        camera.position.z += (target.current[2] - camera.position.z) * .075
    })

    useEffect(() => {
        switch (state) {
            case State.INTRO:
                target.current = [15, 10, 5]
                break
        }
    }, [state])

    useEffect(() => {  
        camera.position.set(20, 10, -20)
    }, [ map])

    return null
}