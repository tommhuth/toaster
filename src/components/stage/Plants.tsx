import { invalidate, useFrame } from "@react-three/fiber"
import { Vec3, Cylinder } from "cannon-es"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { Mesh, BufferAttribute, CircleGeometry, MeshBasicMaterial, Vector3 } from "three"
import { Tuple3 } from "../../types"
import { Body, CollisionEvent, ShapeDefinition, useCannonWorld, useInstancedBody } from "../../utils/cannon"
import { clamp, setColorAt } from "../../utils/utils"
import { useInstance } from "../InstancedMesh"
import { useStageObjects } from "../../utils/hooks"
import RidgidStageObject from "../RidgidStageObject"
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
    let ref = useRef<Mesh<CircleGeometry, MeshBasicMaterial>>(null) 

    useEffect(() => {
        let onCollide = (e: CollisionEvent) => {
            let target = [e.target, e.body].find(i => i.userData.type === "ball")

            if (target) {
                let bodies = world.bodies.filter(i => i !== target && (i as Body).userData.type === ObjectType.BOX)
                let direction = new Vec3()

                for (let b of bodies) {
                    direction.copy(b.position).vsub(body.position, direction)

                    let effect = clamp(1 - direction.length() / explosionDistance, 0, 1) ** 3 * b.mass * explosionEffect

                    direction.normalize()
                    b.wakeUp()
                    b.applyImpulse(direction.scale(effect))
                } 

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

            attribute.set([currentValue * .98], index)  

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
        </>

    )
}


export default function Plants() {
    let plants = useStageObjects<Plant>(ObjectType.PLANT)

    return (
        <>
            {plants.map(i => {
                return (
                    <Plant {...i} key={i.id} />
                )
            })}
        </>
    )
}