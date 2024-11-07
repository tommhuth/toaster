import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import Config from "../Config"
import { setPanning, State, store, useStore } from "../data/store"
import { Tuple3 } from "../types"
import { clamp } from "../utils/utils"
import { Vector2, Vector3 } from "three"
import { damp } from "three/src/math/MathUtils"

export const startPosition: Tuple3 = [20, 20, -20]

export default function Camera() {
    const { camera } = useThree()
    const state = useStore(i => i.state)
    const stage = useStore(i => i.stage)
    const targetPosition = useMemo(() => new Vector3(), [])
    const settings = stage.settings

    useLayoutEffect(() => {
        camera.position.set(...startPosition)
        targetPosition.set(...startPosition)
        camera.lookAt(0, 0, 0)
    }, [camera, startPosition])

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
        let destroy = () => {
            panPossible = false
            setPanning(false)
        }
        let initalize = (clientX: number, clientY: number) => {
            setPanning(true)
            startPosition.set(clientX, 0, clientY)
            previousDirection.copy(startPosition)
        }
        let updateTargetPosition = (clientX: number, clientY: number, scale: number) => {
            direction.set(clientX, 0, clientY)
                .sub(previousDirection)
                .applyQuaternion(camera.quaternion)

            previousDirection.set(clientX, 0, clientY)
            targetPosition.add(new Vector3(direction.x * -scale, 0, direction.z * -scale))
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
        let mousemove = ({ clientX, clientY }: MouseEvent) => {
            let { panning } = store.getState()
            let scale = .025

            if (panning) {
                updateTargetPosition(clientX, clientY, scale)
            }
        }
        let mousedown = ({ clientX, clientY, target }: MouseEvent) => { 
            if ((target as Element).className === "panner") { 
                panPossible = true
                setPanning(true)
            }

            if (panPossible) {
                initalize(clientX, clientY)
            }
        }
        let touchstart = (e: TouchEvent) => {
            let startsAtG = (e.target as Element).className === "panner"

            if (startsAtG) { 
                panPossible = true
                setPanning(true)
            }

            if (e.touches.length === 2 || startsAtG) {
                e.preventDefault()
                panPossible = true
                initalize(e.touches[0].clientX, e.touches[0].clientY)
            }
        }
        let touchmove = (e: TouchEvent) => {
            let { panning } = store.getState()
            let scale = .065
            let touches = e.touches
            let { clientX, clientY } = touches[0] 

            if (panning) {
                e.preventDefault()
                updateTargetPosition(clientX, clientY, scale)
            }
        }
        let touchend = (e: TouchEvent) => {
            if (e.touches.length < 2) {
                destroy()
            }
        }

        window.addEventListener("contextmenu", contextmenu)
        window.addEventListener("keydown", keydown)
        window.addEventListener("mousedown", mousedown)
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", destroy)
        window.addEventListener("touchstart", touchstart, { passive: false })
        window.addEventListener("touchmove", touchmove, { passive: false })
        window.addEventListener("touchend", touchend)

        return () => {
            window.removeEventListener("mousedown", mousedown)
            window.removeEventListener("mousemove", mousemove)
            window.removeEventListener("mouseup", destroy)
            window.removeEventListener("contextmenu", contextmenu)
            window.removeEventListener("keydown", keydown)
            window.removeEventListener("touchstart", touchstart)
            window.removeEventListener("touchmove", touchmove)
            window.removeEventListener("touchend", touchend)
        }
    }, [state])

    useFrame((state, delta) => {
        camera.position.x = damp(camera.position.x, targetPosition.x, 5.5, delta)
        camera.position.z = damp(camera.position.z, targetPosition.z, 5.5, delta)
    })

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