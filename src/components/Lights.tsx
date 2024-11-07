import { useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { CameraHelper, DirectionalLight, Mesh, Vector3 } from "three"
import Config from "../Config"
import { Only } from "../utils/utils"
import { startPosition } from "./Camera"
import { Tuple3 } from "../types"

let position = new Vector3(10, 10, 8).normalize()

export default function Lights() {
    let { viewport, camera } = useThree()
    let lightRef = useRef<DirectionalLight>(null)
    let updateShadowFrustum = useCallback((light: DirectionalLight) => {
        let buffer = 4

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

        lightRef.current?.position.copy(position)

        window.addEventListener("resize", resize)
        window.removeEventListener("resize", resize)
    }, [])

    return (
        <>
            <Only if={Config.DEBUG}>
                {lightRef.current?.shadow.camera && <cameraHelper camera={lightRef.current?.shadow.camera} />}
            </Only>

            <axesHelper position={[0, 3, 0]} scale={5} />

            <directionalLight
                position={[-position.x, position.y * .25, -position.z]}
                intensity={.95}
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