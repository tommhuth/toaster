import React, { useEffect, useState, useCallback, useRef } from "react"
import { useThree } from "react-three-fiber"
import { Vector3, Raycaster } from "three"
import { v4 } from "uuid"
import Ball from "./Ball"

export default function Launcher() {
    let { camera, scene, mouse } = useThree()
    let ref = useRef()
    let [balls, setBalls] = useState([])
    let launch = useCallback((velocity) => {
        setBalls((prev) => [
            ...prev,
            {
                key: v4(),
                position: [0, 1, 10],
                velocity,
            },
        ])
    }, [])

    useEffect(() => {
        let raycaster = new Raycaster()
        let point = new Vector3()
        let onMouseMove = () => {
            raycaster.setFromCamera(mouse, camera)

            let intersection = raycaster.intersectObjects(
                scene.children.filter((i) => i.userData.floor)
            )[0]

            if (intersection) {
                point = intersection.point
                ref.current.setFromPoints([
                    new Vector3(0, .01, 10),
                    new Vector3(point.x, .01, point.z),
                ])
            }
        }
        let onClick = () => {
            let direction = point.clone().sub(new Vector3(0, 0, 10))
            let y = Math.max(Math.min(direction.length() * .75, 20), 0)

            launch([direction.x, y , direction.z])
        }

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("click", onClick)

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("click", onClick)
        }
    }, [])

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
