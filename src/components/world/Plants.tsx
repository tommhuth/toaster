import { useFrame, useLoader } from "@react-three/fiber"
import { useMemo } from "react"
import { DoubleSide, Mesh } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { ObjectType } from "../../data/stages"
import { useShader } from "../../utils/hooks"
import { white } from "../../utils/materials"
import { glsl } from "../../utils/utils"
import InstancedMesh from "../InstancedMesh"
import noise from "../../shaders/noise.glsl"

const plantMaterial = white.clone()

export default function Plants() {
    let count = 10
    let glb = useLoader(GLTFLoader, "/models/plant.glb")
    let mesh = glb?.scene.children[0] as Mesh
    let attributes = useMemo(() => {
        return new Float32Array(new Array(count).fill(0))
    }, [])
    let { onBeforeCompile, uniforms } = useShader({
        uniforms: {
            uTime: { value: 0 },
        },
        vertex: {
            head: glsl`
                uniform float uTime;
                attribute float aEffect;
                ${noise}
            `,
            main: glsl`
                vec4 globalPosition = instanceMatrix *  vec4(position, 1.);
                float heightEffect = clamp((position.y - .9) / 4., 0., 1.); 
                vec2 npos = globalPosition.xz * .35 + uTime;
                
                globalPosition = modelMatrix * globalPosition; 

                transformed.x += noise(npos) * aEffect * heightEffect;
                transformed.y -= noise(npos) * aEffect * heightEffect; 
            `
        }
    })

    useFrame(() => {
        uniforms.uTime.value += .025
        uniforms.uTime.needsUpdate = true
    })

    return (
        <InstancedMesh count={count} name={ObjectType.PLANT}>
            <primitive attach="geometry" object={mesh?.geometry} >
                <instancedBufferAttribute
                    needsUpdate={true}
                    attach="attributes-aEffect"
                    args={[attributes, 1, false, 1]}
                />
            </primitive>
            <primitive
                object={plantMaterial}
                onBeforeCompile={onBeforeCompile}
                attach="material"
                side={DoubleSide}
            />
        </InstancedMesh>
    )
}