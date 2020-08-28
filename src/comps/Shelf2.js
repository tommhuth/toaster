import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3 } from "cannon"
import { v4 } from "uuid"
import Obj from "./Obj"
import { useGeometry } from "./Chair"
import random from "@huth/random"

export default function Shelf2({
    x = 0,
    z = 0,
    y = 0,
    width = 5,
    height = 3,
    depth = 2.5,
    untouchable = false,
}) {
    let innerSize = 0.125
    let outerSize = 0.25
    let { ref, body } = useCannon({
        position: [x, y + height / 2 + outerSize / 2, z],
        mass: 30,
        userData: { shelf: true, untouchable },
    })
    let geometry = useGeometry("shelf2")
    let [spaces, setSpaces] = useState([])
    let [objects, setObjects] = useState([])

    useEffect(() => {
        let objects = []

        for (let space of spaces) {
            let x = space.x - space.width / 2
            let w = random.float(.5, 2)
            let g = random.float(0, 1)

            while (x + w + g < space.x + space.width / 2) {
                let skip = random.boolean(.65)
                let h = random.float(0, space.height - 1.25) + (space.top ? 2 : 0.25)

                if (!skip) {
                    objects.push({
                        id: v4(),
                        x: x + w / 2,
                        y: space.y - space.height / 2 + 0,
                        z: space.z,
                        width: w,
                        height: h,
                        depth: random.float(.5, depth + .5),
                    })
                }

                x = Math.min(x + w + g, space.x + space.width / 2)
                w = random.float(.5, 1.5)
                g = random.float(0, .35)
            }
        }

        setObjects(objects)
    }, [spaces])

    useEffect(() => {
        body.addShape(
            new Box(new Vec3(width / 2, outerSize / 2, depth / 2)),
            new Vec3(0, -height / 2, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2, outerSize / 2, depth / 2)),
            new Vec3(0, height / 2, 0)
        )

        body.addShape(
            new Box(new Vec3(width / 2, innerSize / 2, depth / 2 - innerSize)),
            new Vec3(0, 0, -innerSize)
        )

        body.addShape(
            new Box(new Vec3(outerSize / 2, height / 2, depth / 2)),
            new Vec3(-width / 2 + outerSize / 2, 0, 0)
        )
        body.addShape(
            new Box(new Vec3(outerSize / 2, height / 2, depth / 2)),
            new Vec3(width / 2 - outerSize / 2, 0, 0)
        )

        setSpaces([
            {
                width: width - 1,
                depth,
                height: 3,
                y: height + outerSize + 3 / 2,
                z,
                x
            }
        ])
    }, [])

    return (
        <>
            {objects.map((i) => {
                return <Obj key={i.id} {...i} />
            })}
            {spaces.map((i, index) => {
                return null

                /*
                return (
                    <mesh receiveShadow castShadow key={index} position={[i.x, i.y, i.z]} visible={false}>
                        <boxBufferGeometry args={[i.width, i.height, i.depth]} attach="geometry" />
                        <meshLambertMaterial color="black" attach="material" />
                    </mesh>
                )
                */
            })}
            <mesh geometry={geometry} castShadow receiveShadow ref={ref}>
                <meshLambertMaterial color="#CCC" attach="material" />
            </mesh>
        </>
    )
}
