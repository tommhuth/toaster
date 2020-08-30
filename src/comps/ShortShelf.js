import React, { useEffect } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3 } from "cannon" 
import { useGeometry } from "../utils/hooks"
import { useStore } from "../store"

export default function Shelf2({
    x = 0,
    z = 0,
    y = 0,  
}) {
    let innerSize = 0.125
    let outerSize = 0.25
    let width = 5
    let height = 3
    let depth = 2.5
    let { ref, body } = useCannon({
        position: [x, y + height / 2 + outerSize / 2, z],
        mass: 30,
        userData: { shelf: true },
    })
    let geometry = useGeometry("shelf2")
    let actions = useStore(i => i.actions)

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

        actions.createSpaces([
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
        <mesh geometry={geometry} castShadow receiveShadow ref={ref}>
            <meshLambertMaterial color="#fff" attach="material" />
        </mesh>
    )
}
