import { useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useRef } from "react"
import Config from "../Config"
import { setPanning, State, store, useStore } from "../data/store"
import { Tuple3 } from "../types"
import { clamp } from "../utils/utils"
import { Vector2, Vector3 } from "three"

export const startPosition: Tuple3 = [10, 10, -10]

export default function Camera() {
    const { camera } = useThree()
    const state = useStore(i => i.state)
    const stage = useStore(i => i.stage)
    const position = useRef([...startPosition])
    const settings = stage.settings

    useLayoutEffect(() => {
        camera.position.set(...startPosition)
        camera.lookAt(0, 0, 0)
    }, [camera, startPosition])

    useLayoutEffect(() => {
        position.current = [...stage.settings.center]
        position.current[0] += startPosition[0]
        position.current[2] += startPosition[2]
    }, [stage])

    useLayoutEffect(() => {
        let onResize = () => {
            let zoom = clamp((window.innerWidth - 450) / 600, 0, 1)

            camera.zoom = zoom * 25 + 32

            camera.updateProjectionMatrix()
        }

        window.addEventListener("resize", onResize)
        onResize()

        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [camera])

    useEffect(() => {
        if (state !== State.PLAYING) {
            return
        }

        let panPossible = false
        let startPosition = new Vector3()
        let previousDirection = new Vector3()
        let direction = new Vector3()
        let id: number
        let pointermove = ({ clientX, clientY, pointerId }: PointerEvent) => {
            if (pointerId !== id) {
                return
            }

            let { panning } = store.getState()

            if (clientY > window.innerHeight - 300 && !panPossible) {
                panPossible = true
            } else if (panning) {
                direction.set(clientX, 0, clientY)
                    .sub(previousDirection)
                    .applyQuaternion(camera.quaternion)

                previousDirection.set(clientX, 0, clientY)
                camera.position.add(new Vector3(direction.x * -.01, 0, direction.z * -.01))
            }
        }
        let pointerdown = ({ clientX, clientY, pointerId }: PointerEvent) => {
            if (id) {
                return 
            }
            
            id = pointerId

            if (panPossible) {
                setPanning(true)
                startPosition.set(clientX, 0, clientY)
                previousDirection.copy(startPosition)
            }
        }
        let pointerup = () => {
            setPanning(false)
            panPossible = false
        }
        let contextmenu = (e: Event) => {
            e.preventDefault()
            panPossible = true
        }
        let keydown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                panPossible = true
            }
        }
        let touchmove = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                e.preventDefault()
                panPossible = true
                setPanning(true)
            }
        }

        window.addEventListener("pointermove", pointermove)
        window.addEventListener("pointerdown", pointerdown)
        window.addEventListener("pointerup", pointerup)
        window.addEventListener("contextmenu", contextmenu)
        window.addEventListener("keydown", keydown)
        window.addEventListener("touchmove", touchmove, { passive: true })
        window.addEventListener("touchstart", touchmove, { passive: true })

        return () => {
            window.removeEventListener("pointermove", pointermove)
            window.removeEventListener("pointerdown", pointerdown)
            window.removeEventListener("pointerup", pointerup)
            window.removeEventListener("contextmenu", contextmenu)
            window.removeEventListener("keydown", keydown)
            window.removeEventListener("touchmove", touchmove)
            window.removeEventListener("touchstart", touchmove)
        }
    }, [state])


    if (!Config.DEBUG) {
        return null
    }

    return (
        <mesh position={settings.center}>
            <boxGeometry args={[settings.boundingBox[0], 1, settings.boundingBox[1]]} />
            <meshBasicMaterial color="yellow" wireframe opacity={1} transparent />
        </mesh>
    )
}