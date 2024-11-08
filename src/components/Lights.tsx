import { useFrame, useThree } from "@react-three/fiber"
import { useCallback, useLayoutEffect, useRef } from "react"
import { DirectionalLight, Vector3 } from "three"
import Config from "../Config"
import { Only, roundTo } from "../utils/utils"
import { cameraDirection } from "./Camera"

let lightDirection = new Vector3(1, .5, .4).normalize()

export default function Lights() {
    let { viewport, camera, scene } = useThree()
    let lightRef = useRef<DirectionalLight>(null)
    let time = useRef(Infinity)
    let updateShadowFrustum = useCallback((light: DirectionalLight) => {
        let buffer = 4

        light.target.position.copy(lightDirection)

        // left - right
        light.shadow.camera.near = -viewport.width * .5 - buffer
        light.shadow.camera.far = viewport.width * .5 + buffer

        // top - bottom
        light.shadow.camera.left = -viewport.height * .5 - buffer
        light.shadow.camera.right = viewport.height * 1 + buffer

        // bottom left - top right diag
        light.shadow.camera.top = 25 + buffer
        light.shadow.camera.bottom = -25 - buffer

        light.shadow.camera.updateProjectionMatrix()
    }, [viewport])

    useLayoutEffect(() => {
        let resize = () => lightRef.current && updateShadowFrustum(lightRef.current)

        window.addEventListener("resize", resize)
        window.removeEventListener("resize", resize)

        if (lightRef.current) {
            scene.add(lightRef.current.target)
        }
    }, [])

    useFrame((state, delta) => {
        let light = lightRef.current
        let x = camera.position.x - cameraDirection.x
        let z = camera.position.z - cameraDirection.z
        let updateAt = 2000 // every 2s

        time.current += delta * 1000

        if (!light || time.current < updateAt) {
            return
        } else { 
            time.current = 0
        }

        light.position.x = roundTo(x, 1)
        light.position.z = roundTo(z, 1)

        light.target.position.x = light.position.x - lightDirection.x
        light.target.position.z = light.position.z - lightDirection.z
    })

    return (
        <>
            <Only if={Config.DEBUG}>
                <axesHelper position={[0, 3, 0]} scale={5} />
                {lightRef.current?.shadow.camera && <cameraHelper camera={lightRef.current?.shadow.camera} />}
            </Only>

            <directionalLight
                position={[
                    -lightDirection.x,
                    lightDirection.y * .25,
                    -lightDirection.z
                ]}
                intensity={.7}
                color={"white"}
            />

            <directionalLight
                color={"#fff"}
                intensity={1.5}
                castShadow
                onUpdate={updateShadowFrustum}
                ref={lightRef}
                shadow-radius={2.25}
                shadow-mapSize={[512, 512]}
                shadow-bias={-0.003}
            />

            <ambientLight intensity={.4} color="#fff" />
        </>
    )
}