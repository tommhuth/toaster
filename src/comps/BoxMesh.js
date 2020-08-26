import React from "react"

export default function Boxy({
    x = 0,
    y = 0,
    z = 0,
    width = 1,
    height = 1,
    depth = 1,
    color = "red",
    rotation = [0, 0, 0],
    visible = true,
}) {
    return (
        <mesh  castShadow receiveShadow visible={visible} position={[x, y, z]} rotation={rotation}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshLambertMaterial color={color} attach="material" />
        </mesh>
    )
}