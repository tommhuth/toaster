import { Vec3, Box as BoxShape, Quaternion } from "cannon-es"
import { useEffect, useMemo, useRef, useState } from "react"
import { Group, Line3, Vector3 } from "three"
import { addBox, score, useStore } from "../../data/store"
import { Tuple2, Tuple3 } from "../../types"
import { Body, CollisionEvent, useInstancedBody } from "../../utils/cannon"
import { Only, setMatrixAt } from "../../utils/utils"
import { useInstance } from "../InstancedMesh"
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

function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3

    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}

function easeOutQuart(x: number): number {
    return 1 - Math.pow(1 - x, 4)
}


function Box({
    size = [1, 1, 1],
    dead,
    id,
    index: boxIndex,
    rotation = [0, 0, 0],
    position = [0, 0, 0]
}: BoxProps) {
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
        ready: ready && !dead,
        userData: { type: ObjectType.BOX, isDead: false }
    })
    let ref = useRef<Group>(null)
    let stage = useStore(i => i.stage)

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

    useEffect(() => {
        if (dead && typeof index === "number") {
            const targetY = random.integer(4, 6)
            const rot = new Quaternion().setFromEuler(0, 0, 0)

            return animate({
                from: {
                    y: 0,
                    scale: 1,
                    rx: body.quaternion.x,
                    ry: body.quaternion.y,
                    rz: body.quaternion.z,
                    rw: body.quaternion.w
                },
                to: { y: targetY, scale: 0, rx: rot.x, ry: rot.y, rz: rot.z, rw: rot.w },
                duration: 900,
                render({ y, scale, rx, ry, rz, rw }) {
                    setMatrixAt({
                        instance,
                        index: index as number,
                        position: [
                            body.position.x,
                            body.position.y + easeOutQuart(y / targetY) * targetY,
                            body.position.z
                        ],
                        scale: size.map(i => i * easeOutElastic(scale / 1)) as Tuple3,
                        rotation: [rx, ry, rz, rw]
                    })
                },
            })
        }
    }, [dead])

    useFrame(() => {
        if (ref.current && !dead) {
            ref.current.position.copy(body.position as unknown as Vector3)
        }
    })

    useFrame(() => {
        if (stage.settings.exitY && body.position.y < stage.settings.exitY && !dead) {
            score(id)
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
            <Only if={dead}>
                <Html as="div" center >
                    <div
                        style={{
                            fontSize: "1.85em",
                            fontFamily: "var(--font-sans)",
                            fontWeight: 900,
                            padding: ".25em .5em",
                            border: ".15em solid white",
                            animation: dead ? "msg 2s both" : undefined,
                            display: !dead ? "none" : undefined,
                            color: "white",
                        }}
                    >
                        +100
                    </div>
                </Html>
            </Only> 
        </group>
    )
}

export default function Boxes() {
    let boxes = useStore(i => i.boxes)

    return (
        <>
            {boxes.map((i, index) => {
                return <Box key={i.id} {...i} index={index} />
            })}
        </>
    )
}