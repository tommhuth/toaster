import React from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3 } from "cannon"

export default function Floor({
    y = 0,
    z = 0,
    x = 0,
    width = 35,
    height = 2,
    depth = 100,
    color = 0x0000FF,
}) {
    let { ref } = useCannon({
        position: [x, y, z],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        userData: { floor: true },
    })

    return (
        <mesh castShadow receiveShadow ref={ref} userData={{ floor: true }}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshLambertMaterial color={color} attach="material" />
        </mesh>
    )
}