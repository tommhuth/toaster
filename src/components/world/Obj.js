import React, { useState, useEffect, useRef } from "react"
import { useCannon } from "../../utils/cannon"
import { useDefaultValue } from "../../utils/hooks"
import { Box, Vec3 } from "cannon"
import { Color } from "three"
import { useStore } from "../../utils/store"
import random from "@huth/random"
import animate from "../../utils/animate"
import State from "../../utils/const/State"

function Obj({ x, y, z, width, height, depth, rotation: incomingRotation }) {
    let actions = useStore(i => i.actions)
    let state = useStore(i => i.data.state)
    let defaultPosition = useDefaultValue([x, y, z])
    let [color] = useState(
        () => random.pick("#fcad03", "#fcad03", "#666", "#fcad03", "#ccc")
    )
    let dead = useRef(false) 
    let [flash, setFlash] = useState(false)
    let [rotation] = useState(() => {
        if (typeof incomingRotation === "number") {
            return incomingRotation
        }

        return  random.boolean() ? random.float(-.2, .2) : 0
    })
    let { ref } = useCannon({
        position: [x, y + height / 2, z],
        mass: width * height * depth * .5,
        userData: { obj: true },
        rotation: [0, rotation, 0],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        onCollide(e) {
            if (e.body.userData.floor && !dead.current && state === State.PLAYING) {
                dead.current = true
                actions.score()
                setFlash(true)
            }
        }
    }, [state]) 

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
            <meshPhongMaterial shininess={4} specular={0xaaaaaa} color={color} attach="material" />
        </mesh>
    )
}

export default React.memo(Obj)