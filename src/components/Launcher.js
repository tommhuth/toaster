import React, { useEffect, useState, useCallback, useRef } from "react"
import { useThree } from "react-three-fiber"
import { Vector3, Raycaster } from "three"
import random from "@huth/random"
import Ball from "./world/Ball"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

function Launcher({ position }) {
    let { camera, scene, mouse } = useThree()
    let ref = useRef()
    let state = useStore(i => i.data.state)
    let [balls, setBalls] = useState([])
    let launch = useCallback((velocity) => {
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
            let point = new Vector3()
            let origin = new Vector3(...position)
            let onMouseMove = () => {
                raycaster.setFromCamera(mouse, camera)

                let intersection = raycaster.intersectObjects(
                    scene.children.filter((i) => i.userData.floor)
                )[0]

                if (intersection) {
                    point = intersection.point
                    ref.current.setFromPoints([
                        origin,
                        new Vector3(point.x, position[1], point.z),
                    ])
                }
            }
            let onClick = () => {
                let direction = point.clone().sub(origin)
                let y = Math.min(direction.length() * .85, 20)

                launch([direction.x, y, direction.z])
            }

            window.addEventListener("mousemove", onMouseMove)
            window.addEventListener("click", onClick)

            return () => {
                window.removeEventListener("mousemove", onMouseMove)
                window.removeEventListener("click", onClick)
            }
        }
    }, [state])

    return (
        <>
            <line>
                <lineBasicMaterial color="orange" attach="material" />
                <bufferGeometry ref={ref} attach="geometry" />
            </line>

            {balls.map((i) => (
                <Ball key={i.id} {...i} />
            ))}
        </>
    )
}

export default React.memo(Launcher)