import React, { useEffect, useState } from "react"
import { useCannon } from "../../utils/cannon"
import { Box, Vec3, Quaternion, Cylinder } from "cannon"
import { resource, useAsyncModel } from "../../utils/hooks"
import random from "@huth/random"

function Stick({ x = 0, y = 0, z = 0, untouchable }) {
    let [height] = useState(() => random.float(3, 5))
    let [radius] = useState(() => random.float(.1, .1))
    let { ref } = useCannon({
        position: [x, y + height / 2, z],
        mass: 15,
        shape: new Box(new Vec3(radius, height / 2, radius)),
        rotation: [0, 0, 0],
        userData: { stick: true, untouchable },
    })

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <cylinderBufferGeometry args={[radius, radius, height, 6]} attach="geometry" />
            <meshLambertMaterial
                color="#fff"
                attach="material"
                emissive={0xffffff}
                emissiveIntensity={.15}
            />
        </mesh>
    )
}


let bowl = resource("bowl")

function Bowl({
    x = 0,
    z = 0,
    y = 0,
    height = 2,
    untouchable = false,
}) {
    let { ref, body } = useCannon({
        position: [x, y + height / 2, z],
        mass: 30,
        userData: { deco: true, untouchable },
    })
    let geometry = useAsyncModel(bowl)

    useEffect(() => {
        let q = Math.PI / 4
        let radius = 0.35

        body.addShape(new Box(new Vec3(0.2, height / 2, 0.075)), new Vec3(0, 0, -radius))
        body.addShape(new Box(new Vec3(0.2, height / 2, 0.075)), new Vec3(0, 0, radius))

        body.addShape(new Box(new Vec3(0.075, height / 2, 0.2)), new Vec3(-radius, 0, 0))
        body.addShape(new Box(new Vec3(0.075, height / 2, 0.2)), new Vec3(radius, 0, 0))

        body.addShape(
            new Box(new Vec3(0.075, height / 2, 0.2)),
            new Vec3(-Math.cos(q) * radius, 0, Math.sin(q) * radius),
            new Quaternion().setFromAxisAngle(new Vec3(0, 1, 0), q)
        )
        body.addShape(
            new Box(new Vec3(0.075, height / 2, 0.2)),
            new Vec3(-Math.cos(-q) * radius, 0, Math.sin(-q) * radius),
            new Quaternion().setFromAxisAngle(new Vec3(0, 1, 0), -q)
        )
        body.addShape(
            new Box(new Vec3(0.075, height / 2, 0.2)),
            new Vec3(-Math.cos(-q * 3) * radius, 0, Math.sin(-q * 3) * radius),
            new Quaternion().setFromAxisAngle(new Vec3(0, 1, 0), -q * 3)
        )
        body.addShape(
            new Box(new Vec3(0.075, height / 2, 0.2)),
            new Vec3(-Math.cos(q * 3) * radius, 0, Math.sin(q * 3) * radius),
            new Quaternion().setFromAxisAngle(new Vec3(0, 1, 0), q * 3)
        )

        body.addShape(
            new Cylinder(radius, radius, 0.1, 8),
            new Vec3(0, -height / 2 + 0.2, 0),
            new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
        )
    }, [])


    return (
        <>
            <Stick x={x} y={y + 1} z={z} />

            <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
                <meshLambertMaterial
                    color="#fff"
                    attach="material"
                    emissive={0xffffff}
                    emissiveIntensity={.15}
                />
            </mesh>
        </>
    )
}

export default React.memo(Bowl)