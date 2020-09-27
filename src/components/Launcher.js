import React, { useEffect, useState, useCallback, useRef } from "react"
import { useThree } from "react-three-fiber"
import { Vector3, Raycaster, Vector2 } from "three"
import random from "@huth/random"
import Ball from "./world/Ball"
import { useStore } from "../utils/store"
import State from "../utils/const/State"

function Launcher() {
    let { camera, scene, mouse } = useThree()
    let state = useStore(i => i.data.state)
    let actions = useStore(i => i.actions)
    let marker = useRef()
    let ballCount = useRef(0)
    let [balls, setBalls] = useState([])
    let [markerPosition, setMarkerPosition] = useState([0, -1, 0])
    let launch = useCallback((velocity, position) => {
        ballCount.current++
        actions.setBallsCount(ballCount.current)
        setBalls((prev) => [
            ...prev,
            {
                id: random.id(),
                position,
                velocity,
            },
        ])
    }, [])
    let removeBall = useCallback((id)=> {
        setBalls(prev => prev.filter(i=>i.id !== id))
    }, [])

    useEffect(() => {
        if (state === State.PLAYING) {
            let raycaster = new Raycaster()
            let end = new Vector3()
            let origin = new Vector3()
            let mouseDown = false
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

                if (mouseDown) {
                    let r = origin.distanceTo(end)

                    marker.current.scale.set(r, 1, r)
                }
            }
            let onMouseDown = (e) => {
                let intersection = doRaycast()

                origin.set(intersection.x, 0, intersection.z)
                actions.startLaunch([e.clientX, e.clientY])
                setMarkerPosition([intersection.x, .0001, intersection.z])
                marker.current.visible = true
                mouseDown = true
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
                marker.current.visible = false
                marker.current.scale.set(1, 1, 1)
                mouseDown = false
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
                <Ball key={i.id} {...i} removeBall={removeBall} />
            ))}
            <group ref={marker} position={markerPosition}>
                <mesh rotation-x={-Math.PI / 2} >
                    <meshBasicMaterial opacity={.015} color="#ffffff" transparent attach="material" />
                    <circleBufferGeometry attach="geometry" args={[1, 64,]} />
                </mesh>
            </group>
        </>
    )
}

export default React.memo(Launcher)