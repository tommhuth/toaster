import { invalidate, useFrame, useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { Quaternion, Vector3 } from "three"
import Config from "../Config"
import { State, useStore } from "../data/store"
import { Tuple3 } from "../types"
import { clamp, clampDelta } from "../utils/utils"

export default function Camera({
    startPosition = [10, 10, -10]
}: { startPosition?: Tuple3 }) {
    const { camera } = useThree()
    const state = useStore(i => i.state)
    const stage = useStore(i => i.stage)
    const position = useRef([...startPosition])
    const scrolling = useMemo(() => new Vector3(), [])
    const settings = stage.settings

    useEffect(() => {
        if (state === State.PLAYING) {
            let quat = new Quaternion()
            let up = new Vector3(0, 1, 0)
            let mouseleave = () => scrolling.set(0, 0, 0)
            let mousemove = (e: MouseEvent) => {
                let dx = ((window.innerWidth / 2) - e.clientX)
                let dy = ((window.innerHeight / 2) - e.clientY)

                scrolling.set(
                    Math.abs(dx / (window.innerWidth / 2)) ** 8 * Math.sign(dx),
                    0,
                    Math.abs(dy / (window.innerHeight / 2)) ** 8 * Math.sign(dy)
                )

                scrolling.applyQuaternion(quat.setFromAxisAngle(up, -Math.PI / 4))

                invalidate()
            }

            window.addEventListener("mousemove", mousemove)
            document.body.addEventListener("mouseleave", mouseleave)

            return () => {
                window.removeEventListener("mousemove", mousemove)
                document.body.removeEventListener("mouseleave", mouseleave)
            }
        }
    }, [stage, state])

    useEffect(()=> {
        if (state !== State.PLAYING) {
            scrolling.set(0,0,0)
        }
    }, [state, scrolling])

    useLayoutEffect(() => {
        camera.position.set(...startPosition)
        camera.lookAt(0, 0, 0)
    }, [camera, ...startPosition])

    useLayoutEffect(() => {
        position.current = [...stage.settings.center]
        position.current[0] += startPosition[0]
        position.current[2] += startPosition[2]

        camera.position.x = position.current[0] + 2
        camera.position.z = position.current[2] + 2
    }, [stage])

    useFrame((_, delta) => {
        let distancePerSecond = 8 * clampDelta(delta)

        position.current[0] = clamp(
            position.current[0] + scrolling.x * distancePerSecond,
            startPosition[0] + settings.center[0] - settings.boundingBox[0] / 2,
            startPosition[0] + settings.center[0] + settings.boundingBox[0] / 2
        )
        position.current[2] = clamp(
            position.current[2] + scrolling.z * distancePerSecond,
            startPosition[2] + settings.center[2] - settings.boundingBox[1] / 2,
            startPosition[2] + settings.center[2] + settings.boundingBox[1] / 2
        )

        let targetX = position.current[0] + (state === State.PLAYING ? 0 : +4)
        let targetZ = position.current[2] + (state === State.PLAYING ? 0 : +4)
        let dx = targetX - camera.position.x
        let dz = targetZ - camera.position.z

        camera.position.x += (dx) * 4 * clampDelta(delta)
        camera.position.z += (dz) * 4 * clampDelta(delta)

        if (Math.abs(targetZ - camera.position.z) > .01 || Math.abs(targetX - camera.position.x) > .01) {
            invalidate()
        }
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

 