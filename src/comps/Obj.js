import React, { useState, useEffect, useRef } from "react"
import { useCannon } from "../utils/cannon"
import { useDefaultValue } from "../utils/hooks"
import { Box, Vec3 } from "cannon"
import { useStore } from "../store"

export default function Obj({ x, y, z, width, height, depth }) {
    let actions = useStore(i => i.actions)
    let defaultPosition = useDefaultValue([x, y, z])
    let [color] = useState(
        () => ["blue", "darkgray", "orange", "lightgray"][Math.floor(Math.random() * 4)]
    )
    let dead = useRef(false)
    let [offset] = useState(() => Math.random() * 0)
    let [rotation] = useState(()=> {
        return Math.random() > .5 ? Math.random() * .4 - .2 : 0
    })
    let { ref } = useCannon({
        position: [x, y + height / 2 + offset, z],
        mass: width * height * depth * .5,
        rotation:[0, rotation, 0],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        onCollide(e) {
            if (e.body.userData.floor && !dead.current) {
                actions.removeObject()
                dead.current = true
            } 
        }
    }, [])

    useEffect(()=> {
        actions.addObject()
    }, [])

    return (
        <mesh ref={ref} position={defaultPosition}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshLambertMaterial color={color} attach="material" />
        </mesh>
    )
}
