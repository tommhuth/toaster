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
        camera.lookAt(0,0,0)
    }, [])

    useFrame(()=> {
        if (map) {
            if ([State.PLAYING, State.GAME_OVER].includes(state)) {

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

        //camera.zoom += ((map?.zoom || 45) - camera.zoom) * .025
        //camera.updateProjectionMatrix()
    })

    useEffect(() => {
        switch (state) {
            case State.INTRO:
                target.current = [15, 10, 5]
                break
        }
    }, [state]) 
    useEffect(() => {
        camera.position.set(25,10,-25)
    }, [map]) 

    return null
}