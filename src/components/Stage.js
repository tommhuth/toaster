import React, { useEffect, useState } from "react"
import { useStore } from "../utils/store"
import WorldBlock from "./WorldBlock"
import Launcher from "./Launcher"
import Shelf from "./world/Shelf"
import Bowl from "./world/Bowl"
import Chair from "./world/Chair"
import ShortShelf from "./world/ShortShelf"
import Obj from "./world/Obj"
import random from "@huth/random"

export default function Stage({ launcherPosition, world, elements }) {
    let spaces = useStore(i => i.data.spaces)
    let [objects, setObjects] = useState([])
    let actions = useStore(i => i.actions)

    useEffect(() => {
        let id = setTimeout(() => {
            let objects = []

            for (let space of spaces) {
                let x = space.x - space.width / 2
                let w = random.float(.5, 2)
                let g = random.float(0, 1)
                let hasObject = false

                while (x + w + g < space.x + space.width / 2) {
                    let h = random.float(0, space.height - 1.25) + (space.top ? 2 : 0.25)

                    if (random.boolean() || !hasObject) {
                        objects.push({
                            id: random.id(),
                            x: x + w / 2,
                            y: (space.y - space.height / 2) + random.float(.25, .5),
                            z: space.z,
                            width: w,
                            height: h,
                            depth: random.float(.5, space.depth + .5),
                        })

                        hasObject = true
                    }

                    x = Math.min(x + w + g, space.x + space.width / 2)
                    w = random.float(.5, 1.5)
                    g = random.float(0, .35)
                }
            }

            setObjects(objects)
            actions.setObjectCount(objects.length)
        }, 250)

        return () => clearTimeout(id)
    }, [spaces])

    return (
        <>
            {elements.map(i => {
                switch (i.type) {
                    case "shelf":
                        return <Shelf {...i} key={i.type + i.x + i.y + i.z} />
                    case "bowl":
                        return <Bowl {...i} key={i.type + i.x + i.y + i.z} />
                    case "short-shelf":
                        return <ShortShelf {...i} key={i.type + i.x + i.y + i.z} />
                    case "chair":
                        return <Chair {...i} key={i.type + i.x + i.y + i.z} />
                }
            })}
            
            {world.map((i) => {
                return <WorldBlock {...i} key={"world-" + i.x + i.z + i.y} />
            })}

            {objects.map((i) => {
                return <Obj key={i.id} {...i} />
            })}

            <Launcher position={launcherPosition} />
            <WorldBlock isFloor y={-2} width={100} height={4} depth={100} z={0} />
        </>
    )
}

/*

            {spaces.map((i, index) => {
                return (
                    <mesh key={index} position={[i.x, i.y, i.z]} visible={false}>
                        <boxBufferGeometry args={[i.width, i.height, i.depth]} attach="geometry" />
                        <meshLambertMaterial color="black" attach="material" />
                    </mesh>
                )
            })}

            */