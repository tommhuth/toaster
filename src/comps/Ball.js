import React, { useEffect, useRef } from "react"
import { useCannon } from "../utils/cannon"
import { Sphere } from "cannon"
import {useDefaultValue} from "../utils/hooks"

export default function Ball({ radius = 0.25, velocity = [0, 0, 0], position = [0, 3, 0] }) {
    let defaultPosition = useDefaultValue(position)
    let { ref } = useCannon({
        mass: 6,
        velocity,
        position,
        shape: new Sphere(radius),
        userData: { ball: true },
        linearDamping: 0.2,
        angularDamping: 0.2, 
    })

    return (
        <mesh ref={ref} position={defaultPosition} castShadow receiveShadow>
            <sphereBufferGeometry args={[radius, 16, 16]} attach="geometry" />
            <meshPhongMaterial color="yellow" attach="material" />
        </mesh>
    )
}
