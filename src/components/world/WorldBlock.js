import React, { useEffect } from "react"
import { useCannon } from "../../utils/cannon"
import animate from "@huth/animate"
import { Box, Vec3 } from "cannon"

export default function WorldBlock({
    y = 0,
    z = 0,
    x = 0,
    width = 35,
    height = 2,
    depth = 100,
    isFloor = false,
    index = 0
}) {
    let { ref, body } = useCannon({
        position: [x, y + (isFloor ? 0 : -height), z],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        userData: { floor: isFloor },
    })

    useEffect(() => {
        if (!isFloor) {
            return animate({
                from: y - 20,
                to: y,
                duration: 1500,
                delay: index * 150,
                render: (y) => body.position.y = y,
                easing: "easeOutQuart"
            })
        }
    }, [isFloor])

    return (
        <mesh castShadow receiveShadow ref={ref} userData={{ floor: isFloor }}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshPhongMaterial
                dithering={true}
                shininess={4}
                specular={0x0048ff}
                emissive={0x0000FF}
                emissiveIntensity={isFloor ? 0 : .125}
                color={0x0000FF}
                attach="material"
            />
        </mesh>
    )
}