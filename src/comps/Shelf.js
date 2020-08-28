import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3 } from "cannon"
import { useFrame } from "react-three-fiber" 
import { useStore } from "../store"
import { useGeometry } from "./Chair" 

export default function Shelf({
    x = 0,
    z = 0,
    y = 0, 
    rotation = [0, 0, 0],
}) {
    let depth = 2
    let height = 7
    let width = 5
    let actions = useStore(state => state.actions)
    let legRadius = 0.15 
    let [dead, setDead] = useState(false) 
    let { ref, body } = useCannon({
        position: [x, height / 2 + y, z],
        mass: 20,
        rotation,
        userData: { shelf: true },
    })
    let geo = useGeometry("shelf1")

    useFrame(() => {
        let rotation = Math.max(Math.abs(ref.current.rotation.x), Math.abs(ref.current.rotation.z))

        if (!dead && rotation > Math.PI / 2 - .2) {
            setDead(true)
            actions.gameOver()
        }
    })

    useEffect(() => {
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(width / 2, 0, depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(-width / 2, 0, depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(-width / 2, 0, -depth / 2)
        )
        body.addShape(
            new Box(new Vec3(legRadius, height / 2, legRadius)),
            new Vec3(width / 2, 0, -depth / 2)
        )

        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, 0, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, -height / 3, 0)
        )
        body.addShape(
            new Box(new Vec3(width / 2 + legRadius, 0.1, depth / 2 + legRadius)),
            new Vec3(0, height / 3, 0)
        )

        actions.createSpaces([
            {
                y: y + height / 3,
                color: "red",
                x,
                z,
                depth: depth,
                width: width - legRadius * 2,
                height: height / 3 - 0.2,
            },
            {
                y: y + height * 0.66 + 0.1,
                x,
                z,
                color: "blue",
                depth: depth,
                width: width - legRadius * 2,
                height: height / 3 - 0.2,
            },
            {
                y: y + height / 3 + height / 2 + 0.2,
                x,
                z,
                color: "orange",
                depth: depth,
                height: 0.1,
                width: width - legRadius * 2,
                top: true,
            },
        ])
    }, [])


    return (
        <mesh geometry={geo} ref={ref} castShadow receiveShadow>
            <meshLambertMaterial color={0xffffff} attach="material" /> 
        </mesh>
    )
}
