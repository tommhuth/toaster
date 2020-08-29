import React, { useState, useEffect, useRef } from "react"
import { useCannon } from "../utils/cannon"
import { useDefaultValue } from "../utils/hooks"
import { Box, Vec3 } from "cannon"
import { Color } from "three"
import { useStore } from "../store"
import random from "@huth/random"
import animate from "../utils/animate"

export default function Obj({ x, y, z, width, height, depth }) {
    let actions = useStore(i => i.actions)
    let defaultPosition = useDefaultValue([x, y, z])
    let [color] = useState(
        () => random.pick("#00f", "#666", "#fcad03", "#ccc")
    )
    let dead = useRef(false)
    let [offset] = useState(0)
    let [flash, setFlash] = useState(false)
    let [rotation] = useState(() => {
        return random.boolean() ? random.float(-.2, .2) : 0
    })
    let { ref } = useCannon({
        position: [x, y + height / 2 + offset, z],
        mass: width * height * depth * .5,
        rotation: [0, rotation, 0],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        onCollide(e) {
            if (e.body.userData.floor && !dead.current) {
                dead.current = true
                actions.removeObject()
                setFlash(true)
            }
        }
    }, [])

    useEffect(() => {
        actions.addObject()
    }, [])

    useEffect(() => {
        if (flash) {
            let c = new Color()

            return animate({
                from: { color: "#FFF" },
                to: { color: new Color(color).getStyle() },
                duration: 1000, 
                render({ color }) {
                    ref.current.material.color = c.set(color).convertSRGBToLinear() 
                }
            })
        }
    }, [flash])

    return (
        <mesh castShadow receiveShadow ref={ref} position={defaultPosition}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" />
            <meshLambertMaterial color={color} attach="material" />
        </mesh>
    )
}