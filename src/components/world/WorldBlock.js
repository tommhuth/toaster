import React, { useEffect } from "react"
import { useCannon } from "../../utils/cannon" 
import { Box, Vec3 } from "cannon"
import { Color, MeshPhongMaterial } from "three"

let blue = new Color(0x0000ff).convertSRGBToLinear()
let mat = new MeshPhongMaterial({
    shininess: .4,
    specular: 0x0048ff,
    color: blue,
    dithering: true,
    emissive: blue,
    emissiveIntensity: 0,
})
let mat2 = new MeshPhongMaterial({
    shininess: .4,
    specular: 0x0048ff,
    color: blue,
    dithering: true,
    emissive: blue,
    emissiveIntensity: 0.125,
})

export default function WorldBlock({
    y = 0,
    z = 0,
    x = 0,
    width = 35,
    height = 2,
    depth = 100,
    isFloor = false, 
}) {
    let { ref } = useCannon({
        position: [x, y, z],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        userData: { floor: isFloor },
    }) 

    return (
        <mesh material={isFloor?mat:mat2} castShadow receiveShadow ref={ref} userData={{ floor: isFloor }}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
        </mesh>
    )
}