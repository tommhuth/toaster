import React, { useEffect, useState, useCallback, useRef } from "react"
import { useThree } from "react-three-fiber"
import { Vector3, Raycaster } from "three"
import random from "@huth/random"
import Ball from "./world/Ball"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

function Launcher() {
    let { camera, scene, mouse } = useThree()
    let state = useStore(i => i.data.state)
    let actions = useStore(i => i.actions)
    let [balls, setBalls] = useState([])
    let launch = useCallback((velocity, position) => {
        setBalls((prev) => [
            ...prev,
            {
                key: random.id(),
                position,
                velocity,
            },
        ])
    }, [])

    useEffect(() => {
        if (state === State.READY) {
            let raycaster = new Raycaster()
            let end = new Vector3()
            let origin = new Vector3()
            let doRaycast = () => {
                raycaster.setFromCamera(mouse, camera)

                let intersection = raycaster.intersectObjects(
                    scene.children.filter((i) => i.userData.floor)
                )[0]

                return intersection.point
            }
            let onMouseMove = (e) => {
                end.copy(doRaycast())
                actions.moveLaunch([e.clientX, e.clientY])
            }
            let onMouseDown = (e) => {
                let intersection = doRaycast()

                origin.set(intersection.x, 0, intersection.z)
                actions.startLaunch([e.clientX, e.clientY])
            }
            let onMouseUp = () => {
                let direction = end.clone().sub(origin)
                let length = direction.length() * 2
                let movement = direction.normalize().multiplyScalar(Math.min(length, 20))
                let y = Math.min(length * .85, 20)

                if (movement.length() > 3) {
                    launch([movement.x, y, movement.z], origin.toArray())
                }

                actions.stopLaunch()
            }

            window.addEventListener("mousemove", onMouseMove)
            window.addEventListener("mouseup", onMouseUp)
            window.addEventListener("mousedown", onMouseDown)

            return () => {
                window.removeEventListener("mousemove", onMouseMove)
                window.removeEventListener("mouseup", onMouseUp)
                window.removeEventListener("mousedown", onMouseDown)
            }
        }
    }, [state])

    return (
        <>
            {balls.map((i) => (
                <Ball key={i.id} {...i} />
            ))}
        </>
    )
}

export default React.memo(Launcher)