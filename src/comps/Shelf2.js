import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3, Quaternion, Cylinder } from "cannon"
import { useFrame } from "react-three-fiber"
import { v4 } from "uuid"
import BoxMesh from "./BoxMesh"
import Obj from "./Obj"
import { useStore } from "../store"

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
    let [spaces, setSpaces] = useState([])
    let [objects, setObjects] = useState([])

    useEffect(() => {
        let objects = []

        for (let space of spaces) {
            let x = space.x - space.width / 2
            let w = Math.random() * 1.5 + 0.5
            let g = Math.random() * 1

            while (x + w + g < space.x + space.width / 2) {
                let skip = Math.random() > 0.65
                let h = Math.random() * (space.height - 1.25) + (space.top ? 2 : 0.25)

                if (!skip) {
                    objects.push({
                        id: v4(),
                        x: x + w / 2,
                        y: space.y - space.height / 2 + 0,
                        z: space.z,
                        width: w,
                        height: h,
                        depth: Math.random() * depth + 0.5,
                    })
                }

                x = Math.min(x + w + g, space.x + space.width / 2)
                w = Math.random() * 1 + 0.5
                g = Math.random() * 0.35
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
                width : width - 1,
                depth,
                height: 3,
                y: height + outerSize + 3/2,
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
                return (
                    <mesh key={index} position={[i.x, i.y, i.z]} visible={false}>
                        <boxBufferGeometry args={[i.width, i.height, i.depth]} attach="geometry" />
                        <meshLambertMaterial color="black" attach="material" />
                    </mesh>
                )
            })}
            <group ref={ref}>
                <BoxMesh
                    width={width}
                    height={outerSize}
                    depth={depth}
                    y={height / 2}
                    color="#fff"
                />
                <BoxMesh
                    width={width}
                    height={outerSize}
                    depth={depth}
                    y={-height / 2}
                    color="#fff"
                />

                <BoxMesh
                    width={width}
                    height={innerSize}
                    depth={depth - innerSize * 2}
                    z={-innerSize}
                    color="#fff"
                />

                <BoxMesh
                    width={outerSize}
                    height={height}
                    depth={depth}
                    x={width / 2 - outerSize / 2}
                    color="#fff"
                />
                <BoxMesh
                    width={outerSize}
                    height={height}
                    depth={depth}
                    x={-width / 2 + outerSize / 2}
                    color="#fff"
                />
            </group>
        </>
    )
}
