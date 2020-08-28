import React, { useEffect, useState } from "react"
import { useStore } from "../store"
import Launcher from "./Launcher"
import Obj from "./Obj"
import random from "@huth/random"
import { v4 } from "uuid"

export default function Stage({ children }) {
    let spaces = useStore(i => i.data.spaces)
    let [objects, setObjects] = useState([])

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
                            id: v4(),
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
        }, 250)

        return () => clearTimeout(id)
    }, [spaces])

    return (
        <>
            {children}

            {objects.map((i) => {
                return <Obj key={i.id} {...i} />
            })}
            <Launcher />
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