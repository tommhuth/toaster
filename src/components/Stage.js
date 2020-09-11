import React, { useEffect, useState, Suspense } from "react"
import { useStore } from "../utils/store"
import WorldBlock from "./world/WorldBlock"
import Launcher from "./Launcher"
import Shelf from "./world/Shelf"
import Bowl from "./world/Bowl"
import Chair from "./world/Chair"
import ShortShelf from "./world/ShortShelf"  
import Obj from "./world/Obj"
import random from "@huth/random"
import State from "../utils/const/State"
import { useWorld } from "../utils/cannon"
import { Vec3 } from "cannon"

export default function Stage({ launcherPosition, world, elements, objects: incomingObjects = [] }) {
    let spaces = useStore(i => i.data.spaces)
    let state = useStore(i => i.data.state)
    let [objects, setObjects] = useState([])
    let actions = useStore(i => i.actions)
    let cworld = useWorld()

    useEffect(() => {
        let id = setTimeout(() => {
            let objects = []

            for (let space of spaces) {
                let size = random.float(.5, 1.5)
                let gap = random.float(0, 1)
                let skipped = 0
                let d = space.start[space.rotated ? 2 : 0] + (space.rotated ? -(size / 2) : size / 2)
                let isInsideSpace = (d, size, gap, space) => {
                    if (space.rotated) {
                        return d - size - gap > space.end[2]
                    } else {
                        return d + size + gap < space.end[0]
                    }
                }

                while (isInsideSpace(d, size, gap, space)) {
                    let height = random.float(space.height * .25, space.height * .85)

                    if (random.boolean(.75) || skipped >= 1) {
                        objects.push({
                            id: random.id(),
                            x: space.rotated ? space.start[0] : d,
                            y: space.start[1],
                            z: space.rotated ? d : space.start[2],
                            width: space.rotated ? space.size : size,
                            height,
                            depth: space.rotated ? size : random.float(.5, space.size + .5),
                        })
                    } else {
                        skipped++
                    }

                    d = space.rotated ? d - size - gap : d + size + gap
                    size = random.float(.5, 1)
                    gap = random.float(0, .35)
                }
            }

            for (let object of incomingObjects) {
                objects.push({ ...object, id: random.id() })
            }

            setObjects(objects)
            actions.setObjectCount(objects.length)
        }, 250)

        return () => clearTimeout(id)
    }, [spaces])

    useEffect(() => {
        if (spaces.length) {
            actions.ready()
        }
    }, [spaces])

    useEffect(() => {
        if (state === State.GAME_OVER) {
            cworld.gravity.set(0, 2, 0)

            for (let body of cworld.bodies) {
                if (body.mass > 0) {

                    if (body.userData.chair || body.userData.shelf || body.userData.deco) {
                        body.angularVelocity.set(random.float(-.15, .15), random.float(-.2, .2), random.float(-.15, .15))
                        body.applyImpulse(new Vec3(0, random.float(15, 20), 0), body.position.clone())
                    }
                    body.wakeUp()
                }
            }

            let tid = setTimeout(() => cworld.gravity.set(0, -10, 0), 4500)

            return () => {
                clearTimeout(tid)
                cworld.gravity.set(0, -10, 0)
            }
        }
    }, [state])

    return (
        <>
            <Suspense fallback={null}>
                {elements.map(i => {
                    let key = `${i.type}-${i.x || 0}-${i.y || 0}-${i.z || 0}`

                    switch (i.type) {
                        case "shelf":
                            return <Shelf {...i} key={key} />
                        case "bowl":
                            return <Bowl {...i} key={key} />
                        case "short-shelf":
                            return <ShortShelf {...i} key={key} />
                        case "chair":
                            return <Chair {...i} key={key} />
                        default:
                            throw new Error(`Unknown element type ${i.type}`)
                    }
                })}

                {world.map((i) => {
                    return <WorldBlock {...i} key={`world-${i.x || 0}-${i.y || 0}-${i.z || 0}`} />
                })}

                {objects.map((i) => {
                    return <Obj key={i.id} {...i} />
                })}

                <Launcher position={launcherPosition} />
            </Suspense>
        </>
    )
}

/*


            {spaces.map((i, index) => {
                return (
                    <mesh position={i.end} key={index}>
                        <sphereBufferGeometry args={[.2]} attach="geometry" />
                        <meshLambertMaterial color="red" attach="material" />
                    </mesh>
                )
            })}
            {spaces.map((i, index) => {
                return (
                    <mesh key={index} position={[i.x, i.y, i.z]} visible={false}>
                        <boxBufferGeometry args={[i.width, i.height, i.depth]} attach="geometry" />
                        <meshLambertMaterial color="black" attach="material" />
                    </mesh>
                )
            })}

            */