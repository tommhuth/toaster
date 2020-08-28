import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3 } from "cannon"
import { useFrame } from "react-three-fiber"
import { v4 } from "uuid"
import Obj from "./Obj"
import { useStore } from "../store"
import { useGeometry } from "./Chair"
import random from "@huth/random"

export default function Shelf({
    x = 0,
    z = 0,
    y = 0,
    depth = 2,
    height = 7,
    width = 5,
    rotation = [0, 0, 0],
}) {
    let actions = useStore(state => state.actions)
    let legRadius = 0.15
    let [spaces, setSpaces] = useState([])
    let [dead, setDead] = useState(false)
    let [objects, setObjects] = useState([])
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

        setSpaces([
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

    useEffect(() => {
        let objects = []

        for (let space of spaces) {
            let x = space.x - space.width / 2
            let w = random.float(.5, 2)
            let g = random.float(0, 1)

            while (x + w + g < space.x + space.width / 2) {
                let h = random.float(0, space.height - 1.25) + (space.top ? 2 : 0.25)

                if (!random.boolean(.65)) {
                    objects.push({
                        id: v4(),
                        x: x + w / 2,
                        y: (space.y - space.height / 2) + 0,
                        z: space.z,
                        width: w,
                        height: h,
                        depth: random.float(.5, depth + .5),
                    })
                }

                x = Math.min(x + w + g, space.x + space.width / 2)
                w = random.float(.5, 1.5)
                g = random.float(0, .35) 
            }
        }

        setObjects(objects)
    }, [spaces])




    return (
        <>
            {objects.map((i) => {
                return <Obj key={i.id} {...i} />
            })}
            <mesh geometry={geo} ref={ref} castShadow receiveShadow>
                <meshLambertMaterial color={0xffffff} attach="material" />

            </mesh>
        </>
    )
}


/*

            {spaces.map((i, index) => {
                return (
                    <mesh key={index} position={[i.x, i.y, i.z]} visible={false}>
                        <boxBufferGeometry args={[i.width, i.height, i.depth]} attach="geometry" />
                        <meshLambertMaterial color="black" attach="material" />
                    </mesh>
                )
            })}

            */