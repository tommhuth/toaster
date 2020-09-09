import { useEffect, useRef, useLayoutEffect } from "react"
import { useThree, useFrame } from "react-three-fiber"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

export default function Camera() {
    let { camera } = useThree()
    let state = useStore(i => i.data.state)
    let target = useRef([15, 10, 5])

    useFrame(() => {
        camera.position.x += (target.current[0] - camera.position.x) * .01
        camera.position.y += (target.current[1] - camera.position.y) * .01
        camera.position.z += (target.current[2] - camera.position.z) * .01
    })

    useLayoutEffect(() => {
        camera.position.set(...target.current)
    }, [])

    useEffect(() => {
        switch (state) {
            case State.INTRO:
                target.current = [15, 10, 5]
                break
            case State.PLAYING:
                target.current = [10, 10, 10]
                break
        }
    }, [state])

    useEffect(() => {

    }, [])

    return null
}