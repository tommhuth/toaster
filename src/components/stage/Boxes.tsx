import { Vec3, Box as BoxShape } from "cannon-es"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Group, Line3, Vector3 } from "three"
import { addBox, score, useStore } from "../../data/store"
import { Tuple2, Tuple3 } from "../../types"
import { Body, CollisionEvent, useInstancedBody } from "../../utils/cannon"
import { easeOutElastic, Only, setColorAt, setMatrixAt } from "../../utils/utils"
import InstancedMesh, { useInstance } from "../InstancedMesh"
import random from "@huth/random"
import animate from "@huth/animate"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { ObjectType } from "../../data/stages"

interface Location {
    path: Line3
    height: number
    depth: number
}


export function usePopulateLocations(
    locations: Location[],
    rotation: Tuple3,
    sizeRange: Tuple2 = [.1, .3],
    gapRange: Tuple2 = [.05, .2],
) {
    useEffect(() => {
        let boxes: { position: Tuple3, size: Tuple3, rotation: Tuple3 }[] = []
        let vec3 = new Vector3()

        for (let location of locations) {
            let length = location.path.distance()
            let direction = random.pick(1, -1)
            let t = direction === 1 ? 0 : 1
            let width = random.float(...sizeRange)
            let gap = 0
            let canFit = (t: number) => {
                return direction === 1 ? t < 1 : t > 0
            }
            let remainder = (t: number) => {
                return direction === 1 ? 1 - t : t
            }

            t += random.float(0, .1) * direction

            while (canFit(t + ((width + gap) * direction))) {
                let position = location.path.at(t + (width / 2 + gap / 2) * direction, vec3)

                boxes.push({
                    position: position.toArray(),
                    size: [
                        width * length,
                        random.float(location.height * .25, location.height),
                        random.float(location.depth * .5, location.depth)
                    ],
                    rotation,
                })

                t += (width + gap) * direction
                width = random.float(.1, Math.min(.35, remainder(t)))
                gap = random.float(...gapRange)
            }
        }

        addBox(boxes)
    }, [locations])
}

interface BoxProps {
    size: Tuple3
    rotation: Tuple3
    position: Tuple3
    index: number
    dead: boolean 
    id: string
}


function Box({ size = [1, 1, 1], dead, id, index: boxIndex, rotation = [0, 0, 0], position = [0, 0, 0] }: BoxProps) {
    let [index, instance] = useInstance(ObjectType.BOX)
    let [ready, setReady] = useState(false) 
    let definition = useMemo(() => {
        return new BoxShape(new Vec3(size[0] / 2, size[1] / 2, size[2] / 2))
    }, [])
    let startPosition = useMemo(() => [position[0], position[1] + size[1] / 2 + .35, position[2]] as Tuple3, position)
    let [body] = useInstancedBody({
        definition,
        position: startPosition,
        mass: size[0] * size[1] * size[2],
        rotation,
        instance,
        scale: size,
        index,
        ready,
        userData: { type: ObjectType.BOX, isDead: false }
    })
    let ref = useRef<Group>(null)

    useEffect(() => {
        if (!dead) {
            let onCollide = (e: CollisionEvent) => { 
                let target = [e.target, e.body].find(i => i.userData.type === ObjectType.GROUND)

                if (target) {
                    body.userData.isDead = true 
                    score(id)
                }
            }

            body.addEventListener(Body.COLLIDE_EVENT_NAME, onCollide)

            return () => {
                body.removeEventListener(Body.COLLIDE_EVENT_NAME, onCollide)
            }
        }
    }, [dead])

    useLayoutEffect(() => {
        if (index && instance) {
            setColorAt(instance, index, "yellow")
        }
    }, [index, instance]) 

    useFrame(() => {
        if (ref.current && !dead) {
            ref.current.position.copy(body.position as unknown as Vector3)
        }
    })

    useEffect(() => {
        if (index && instance) {
            return animate({
                from: 0,
                to: 1,
                easing: easeOutElastic,
                duration: 800,
                delay: boxIndex * 75,
                end() {
                    setReady(true)
                },
                render(scale) {
                    setMatrixAt({
                        instance,
                        index: index as number,
                        position: startPosition,
                        rotation,
                        scale: size.map(i => i * scale) as Tuple3
                    })
                }
            })
        }
    }, [index, instance])

    return ( 
        <group ref={ref}>
            <Html as="div" center >
                <h1
                    style={{
                        fontSize: "1.5em",
                        fontFamily: "Arial",
                        padding: ".75em 1.5em",
                        opacity: dead ? 0 : 1,
                        transform: `translateY(${dead ? -4 : 0}em)`,
                        transition: "all .5s ease-out",
                        transitionDelay: dead ? "0s" : "5s",
                        visibility: !dead ? "hidden" : undefined,
                        borderRadius: "5em",
                        backgroundColor: "white",
                        color: "blue",
                        boxShadow: "0 0 1em rgba(0,0,0,.3)"
                    }}
                >
                    <Only if={dead}>
                        +1
                    </Only>
                </h1>
            </Html>
        </group>
    )
}

export default function Boxes() {
    let boxes = useStore(i => i.boxes)

    return (
        <>
            <InstancedMesh name={ObjectType.BOX} count={100}>
                <boxGeometry />
                <meshLambertMaterial emissive={"red"} color="yellow" emissiveIntensity={.35} />
            </InstancedMesh>
            {boxes.map((i, index) => {
                return <Box key={i.id} {...i} index={index} />
            })}
        </>
    )
}