import React, { useState, useEffect, useRef } from "react"
import { useCannon } from "../../utils/cannon"
import { useDefaultValue } from "../../utils/hooks"
import { Box, Vec3 } from "cannon"
import { Color, MeshPhongMaterial } from "three"
import { useStore } from "../../utils/store"
import random from "@huth/random"
import animate from "@huth/animate"
import State from "../../utils/const/State"

let yellow = new Color("#fcad03").convertSRGBToLinear()
let mat = new MeshPhongMaterial({
    shininess: .4,
    specular: 0xaaaaaa,
    color: yellow,
    emissive: yellow,
    emissiveIntensity: .25,
})

function Obj({ x, y, z, width, height, depth, rotation: incomingRotation }) {
    let actions = useStore(i => i.actions)
    let state = useStore(i => i.data.state)
    let defaultPosition = useDefaultValue([x, y, z])
    let [color] = useState(
        () => random.pick("#fcad03", "#fcad03", "#fcad03")
    )
    let dead = useRef(false)
    let [flash, setFlash] = useState(false)
    let [visible, setVisible] = useState(false)
    let [rotation] = useState(() => {
        if (typeof incomingRotation === "number") {
            return incomingRotation
        }

        return random.boolean() ? random.float(-.2, .2) : 0
    })
    let { ref, body } = useCannon({
        position: [x, y + height / 2, z],
        mass: width * height * depth * .5,
        userData: { obj: true },
        rotation: [0, rotation, 0],
        shape: new Box(new Vec3(width / 2, height / 2, depth / 2)),
        onCollide(e) {
            if ((e.body.userData.floor || e.body.userData.dead) && !dead.current && state === State.PLAYING) {
                dead.current = true
                body.userData.dead = true
                actions.score()
                setFlash(true)
            }
        }
    }, [state])

    useEffect(() => {
        setTimeout(() => setVisible(true), Math.random() * 350 + 400)
    }, [])

    useEffect(() => {
        if (flash) {
            let c = new Color()

            return animate({
                from: "#FFFFFF",
                to: color,
                duration: 1000,
                easing: "easeOutQuart",
                render(color) {
                    //ref.current.material.color = c.set(color).convertSRGBToLinear()
                }
            })
        }
    }, [flash])

    return (
        <mesh material={mat} castShadow receiveShadow ref={ref} position={defaultPosition} visible={visible}>
            <boxBufferGeometry args={[width, height, depth]} attach="geometry" /> 
        </mesh>
    )
}

export default React.memo(Obj)