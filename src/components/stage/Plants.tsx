import { invalidate, useFrame, useLoader } from "@react-three/fiber"
import { Vec3, Cylinder } from "cannon-es"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Mesh, DoubleSide, BufferAttribute, CircleGeometry, MeshBasicMaterial, Vector3 } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader" 
import { Tuple3 } from "../../types"
import { Body, CollisionEvent, ShapeDefinition, useCannonWorld, useInstancedBody } from "../../utils/cannon"
import { clamp, glsl, setColorAt } from "../../utils/utils"
import InstancedMesh, { useInstance } from "../InstancedMesh"
import noise from "../../shaders/noise.glsl"
import { useShader, useStageObjects } from "../../utils/hooks"
import RidgidStageObject from "../RidgidStageObject"
import { white } from "../../utils/materials"
import { ObjectType, Plant } from "../../data/stages"

interface ChairProps {
    position: Tuple3
    rotation: Tuple3
}

function Plant({ position = [0, 0, 0], rotation = [0, 0, 0] }: ChairProps) {
    let definition = useMemo(() => {
        return [
            [new Cylinder(1, 1, 2, 18), new Vec3(0, -.15, 0)],
            [new Cylinder(0.5, 1, 1.5, 6), new Vec3(0, 1.75, 0)],

        ] as ShapeDefinition
    }, [])
    let [index, instance] = useInstance(ObjectType.PLANT)
    let [body] = useInstancedBody({
        definition,
        position: [position[0], position[1] + 1.15, position[2]],
        mass: 0,
        rotation,
        instance,
        index,
    })
    let world = useCannonWorld()
    let explosionDistance = 15
    let explosionEffect = 25
    let [exploding, setExploding] = useState(false)
    let ref = useRef<Mesh<CircleGeometry, MeshBasicMaterial>>(null)
    let { onBeforeCompile } = useShader({
        vertex: {
            head: glsl`
                varying vec4 globalPosition;
            `,
            main: glsl`
                globalPosition =  vec4(position, 1.) * modelMatrix;
            `
        },
        fragment: {
            head: glsl`
                varying vec4 globalPosition;
            `,
            main: glsl`
                float eff = clamp(length(globalPosition.xyz - vec3(0,0,0)) / 10., 0., 1.) * opacity;

                gl_FragColor = vec4(1., 1., 1., eff * eff * eff);
            `
        }
    })

    useEffect(() => {
        let onCollide = (e: CollisionEvent) => {
            let target = [e.target, e.body].find(i => i.userData.type === "ball")

            if (target) {
                let bodies = world.bodies.filter(i => i !== target)
                let direction = new Vec3()

                for (let b of bodies) {
                    direction.copy(b.position).vsub(body.position, direction)

                    let effect = clamp(1 - direction.length() / explosionDistance, 0, 1) ** 3 * b.mass * explosionEffect

                    direction.normalize()
                    b.wakeUp()
                    b.applyImpulse(direction.scale(effect))
                }

                setExploding(true)

                if (ref.current) {
                    ref.current.material.opacity = 1
                    ref.current.scale.set(1, 1, 1)
                }
            }
        }

        body.addEventListener(Body.COLLIDE_EVENT_NAME, onCollide)

        return () => {
            body.removeEventListener(Body.COLLIDE_EVENT_NAME, onCollide)
        }
    }, [world, body, explosionEffect, explosionDistance])

    useFrame(() => {
        if (index && instance) {
            let attribute = instance.geometry.attributes.aEffect as BufferAttribute
            let currentValue = attribute.array[index]

            attribute.set([currentValue * .8], index)

            if (attribute.array[index] > .001) {
                attribute.needsUpdate = true
                invalidate()
            }
        }
    })

    useEffect(() => {
        if (index && instance) {
            let onCollide = (e: CollisionEvent) => {
                let attribute = instance.geometry.attributes.aEffect as BufferAttribute
                let ball = [e.target, e.body].find(i => i.userData.type === "ball")

                if (ball) {
                    let effect = clamp(ball.velocity.length() * .1, 0, .5)

                    attribute.set([effect], index as number)
                    attribute.needsUpdate = true
                }
            }

            body.addEventListener("collide", onCollide)

            return () => {
                body.removeEventListener("collide", onCollide)
            }
        }
    }, [instance, index])

    useLayoutEffect(() => {
        if (instance && index) {
            setColorAt(instance, index, "white")
        }
    }, [instance, index])

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.material.opacity = 0
            ref.current.scale.set(0, 0, 0)
        }
    }, [])


    useFrame(() => {
        if (!ref.current) {
            return
        }

        ref.current.position.copy(body.position as unknown as Vector3)

        ref.current.scale.x += (0 - ref.current.scale.x) * .065
        ref.current.scale.y += (0 - ref.current.scale.y) * .065
        ref.current.scale.z += (0 - ref.current.scale.z) * .065

        ref.current.material.opacity += (0 - ref.current.material.opacity) * .025
    })

    return (
        <>
            <RidgidStageObject body={body} />
            <mesh ref={ref} rotation-x={Math.PI / 2}>
                <circleGeometry args={[explosionDistance * .65, 32]} />
                <meshBasicMaterial onBeforeCompile={onBeforeCompile} transparent side={DoubleSide} />
            </mesh>
        </>

    )
}

const material = white.clone()

export default function Plants() {
    let glb = useLoader(GLTFLoader, "/models/plant.glb")
    let mesh = glb?.scene.children[0] as Mesh
    let plants = useStageObjects<Plant>(ObjectType.PLANT)
    let count = 10
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
                vec2 npos = globalPosition.xz * .2 + uTime;
                
                globalPosition = modelMatrix * globalPosition; 

                transformed.x += noise(npos) * aEffect * heightEffect;
                transformed.y -= noise(npos) * aEffect * heightEffect; 
            `
        }
    })

    useFrame(() => {
        uniforms.uTime.value += .01
        uniforms.uTime.needsUpdate = true
    })

    return (
        <>
            <InstancedMesh count={count} name={ObjectType.PLANT}>
                <primitive attach="geometry" object={mesh?.geometry} >
                    <instancedBufferAttribute
                        needsUpdate={true}
                        attach="attributes-aEffect"
                        args={[attributes, 1, false, 1]}
                    />
                </primitive>
                <primitive
                    object={material}
                    onBeforeCompile={onBeforeCompile} 
                    attach="material"
                    side={DoubleSide}
                />
            </InstancedMesh>
            {plants.map(i => {
                return (
                    <Plant {...i} key={i.id} />
                )
            })}
        </>
    )
}