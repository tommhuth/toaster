import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { DirectionalLight, Mesh } from "three"
import Config from "../Config"
import { Only } from "../utils/utils"
import { startPosition } from "./Camera"

export default function Lights() {
    let { scene, viewport, camera } = useThree()
    let sun = useRef<DirectionalLight>(null)
    let debug = useRef<Mesh>(null)
    let previousUpdateShadowPosition = useRef([0, 0])
    let sunTargetPosition = [-25, -18, -24]

    useEffect(() => {
        if (sun.current) {
            scene.add(sun.current.target)
        }
    }, [])

    useEffect(() => {
        if (sun.current) {
            let light = sun.current
            let buffer = 4

            // left - right
            light.shadow.camera.near = -viewport.width - buffer
            light.shadow.camera.far = viewport.width + buffer

            // top - bottom
            light.shadow.camera.left = -viewport.height - buffer
            light.shadow.camera.right = viewport.height + buffer

            // bottom left - top right diag
            light.shadow.camera.top = 25 + buffer
            light.shadow.camera.bottom = -25 - buffer

            light.shadow.camera.updateProjectionMatrix()
        }
    }, [viewport])

    useFrame(() => {
        let [x, , z] = camera.position.toArray().map(Math.floor)
        let previous = previousUpdateShadowPosition.current
        let interval = 3
        let needsUpdate = (x % interval === 0 && x !== previous[0]) || (z % interval === 0 && z !== previous[1])

        if (needsUpdate && sun.current) {
            previous[0] = x
            previous[1] = z

            sun.current.position.x = camera.position.x - startPosition[0]
            sun.current.position.z = camera.position.z - startPosition[2]

            sun.current.target.position.x = camera.position.x - startPosition[0] - -sunTargetPosition[0]
            sun.current.target.position.z = camera.position.z - startPosition[2] - -sunTargetPosition[2]

            if (debug.current) {
                debug.current.position.x = camera.position.x - startPosition[0]
                debug.current.position.z = camera.position.z - startPosition[2]
            } 
        }
    })

    return (
        <>
            <Only if={Config.DEBUG}>
                <mesh ref={debug}>
                    <sphereGeometry args={[1.5, 16, 16]} />
                    <meshBasicMaterial color="yellow" wireframe />
                </mesh>
            </Only>
            <directionalLight
                color={"#fff"}
                position={[0, 0, 0]}
                target-position={sunTargetPosition}
                intensity={1.6}
                //castShadow
                ref={sun}
                shadow-radius={2.25}
                shadow-mapSize={[512, 512]}
                shadow-bias={-0.003}
            />  
            <ambientLight intensity={.4} color="#fff" />
        </>
    )
}