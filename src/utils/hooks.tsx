import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import { IUniform, Quaternion, Shader, Vector3 } from "three"
import { ObjectType } from "../data/stages"
import { addPenalty, useStore } from "../data/store"
import { Body } from "./cannon"
import { glsl } from "./utils" 

interface ShaderPart {
    head?: string
    main?: string
}


interface ShaderPart {
    head?: string
    main?: string
}

interface UseShaderParams {
    uniforms?: Record<string, IUniform<any>>
    vertex?: ShaderPart
    fragment?: ShaderPart
}

export function useShader({
    uniforms: incomingUniforms = {},
    vertex = {
        head: "",
        main: "",
    },
    fragment = {
        head: "",
        main: "",
    }
}: UseShaderParams) {
    let uniforms = useMemo(() => {
        return Object.entries(incomingUniforms)
            .map(([key, value]) => ({ [key]: { needsUpdate: false, ...value } }))
            .reduce((previous, current) => ({ ...previous, ...current }), {})
    }, [])

    return {
        uniforms,
        onBeforeCompile(shader: Shader) {
            shader.uniforms = {
                ...shader.uniforms,
                ...uniforms
            }

            shader.vertexShader = shader.vertexShader.replace("#include <common>", glsl`
                #include <common>
         
                ${vertex.head}  
            `)
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", glsl`
                #include <begin_vertex>
        
                ${vertex?.main}  
            `)
            shader.fragmentShader = shader.fragmentShader.replace("#include <common>", glsl`
                #include <common>

                ${fragment?.head}  
            `)
            shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", glsl`
                #include <dithering_fragment> 

                ${fragment?.main}  
            `)
        }
    }
}

export function useStageObjects<T>(type: Omit<ObjectType, ObjectType.BOX>) {
    let objects = useStore(i => i.stage.objects)

    return useMemo(() => objects.filter((i) => i.type === type), [objects]) as T[]
}


let _directionUp = new Vector3(0, 1, 0)
let _vec3 = new Vector3()

export function useOrientationObserver(body: Body): boolean {
    let dead = useRef(false)
    let [rdead, setrdead] = useState(false)
    let stage = useStore(i => i.stage)

    useFrame(() => {
        if (body && !dead.current) {
            _vec3.set(0, 1, 0).applyQuaternion(body.quaternion as unknown as Quaternion) 

            if (_directionUp.dot(_vec3) < .35 || (stage.settings.exitY && body.position.y < stage.settings.exitY)) {
                dead.current = true
                setrdead(true) 
                addPenalty()
            }
        }
    })

    return rdead
}