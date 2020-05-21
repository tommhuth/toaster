import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3, Quaternion, Cylinder } from "cannon"
import { useFrame } from "react-three-fiber"
import { v4 } from "uuid"
import Obj from "./Obj"
import { useStore } from "../store"
import BoxMesh from "./BoxMesh"

export default function Chair({
    x = 0,
    z = 0,
    y = 0,
    height = 1.8,
    depth = 2.2,
    width = 2.75,
    rotation = .35,
    untouchable = false,
}) {
    let thick1 = 0.15
    let thick2 = 0.25
    let aboveFloor = 1.75
    let { ref, body } = useCannon({
        position: [x, y + aboveFloor, z],
        mass: 16,
        userData: { chair: true, untouchable },
    })
    let thick = thick2 + thick1
    let legt = 0.15

    useEffect(() => {
        let quat = new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), -0.1)

        body.addShape(new Box(new Vec3(width / 2, thick / 2, depth / 2)), new Vec3(), quat)
        body.addShape(
            new Box(new Vec3(width / 2, height / 2, thick / 2)),
            new Vec3(0, height / 2 - thick * 0.75, -depth / 2),
            quat
        )

        // legs
        body.addShape(
            new Box(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
            new Vec3(1, -aboveFloor / 2+ .1, -0.5 - 0.25),
            new Quaternion().setFromEuler(0.5, 0, 0.7, "ZYX")
        )

        body.addShape(
            new Box(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
            new Vec3(1, -aboveFloor / 2 + .1, 0.5 - 0.25),
            new Quaternion().setFromEuler(-0.5, 0, 0.7, "ZYX")
        )

        body.addShape(
            new Box(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
            new Vec3(-1, -aboveFloor / 2 + .1, -0.5 - 0.25),
            new Quaternion().setFromEuler(0.5, 0, -0.7, "ZYX")
        )
        body.addShape(
            new Box(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
            new Vec3(-1, -aboveFloor / 2+ .1, 0.5 - 0.25),
            new Quaternion().setFromEuler(-0.5, 0, -0.7, "ZYX")
        )

        body.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), rotation)
    }, [])

    return (
        <group ref={ref}>
            <BoxMesh
                width={width - 0.15}
                height={thick1}
                depth={depth - 0.1}
                rotation={[-0.1, 0, 0]}
                y={-0.156}
                color="white"
            />
            <BoxMesh
                width={width - 0.15}
                height={height - 0.15}
                depth={thick1}
                rotation={[-0.1, 0, 0]}
                y={height / 2 - 0.42}
                z={-depth / 2 - 0.1}
                color="white"
            />

            <BoxMesh
                width={width}
                height={height - 0.2}
                depth={thick2}
                rotation={[-0.1, 0, 0]}
                y={height / 2 - 0.2}
                z={-depth / 2 + 0.051}
                color="white"
            />
            <BoxMesh
                width={width}
                height={thick2}
                depth={depth}
                rotation={[-0.1, 0, 0]}
                y={0.05}
                z={0}
                color="white"
            />


            <BoxMesh
                x={1}
                y={-aboveFloor / 2 + .1}
                z={-0.5 - 0.25}
                width={legt}
                height={aboveFloor}
                depth={legt}
                rotation={[0.5, 0, 0.7, "ZYX"]}
                color="white"
            />
            <BoxMesh
                x={1}
                y={-aboveFloor / 2 + .1}
                z={0.5 - 0.25}
                width={legt}
                height={aboveFloor}
                depth={legt}
                rotation={[-0.5, 0, 0.7, "ZYX"]}
                color="white"
            />
            <BoxMesh
                x={-1}
                y={-aboveFloor / 2 + .1}
                z={-0.5 - 0.25}
                width={legt}
                height={aboveFloor}
                depth={legt}
                rotation={[0.5, 0, -0.7, "ZYX"]}
                color="white"
            />
            <BoxMesh
                x={-1}
                y={-aboveFloor / 2 + .1}
                z={0.5 - 0.25}
                width={legt}
                height={aboveFloor}
                depth={legt}
                rotation={[-0.5, 0, -0.7, "ZYX"]}
                color="white"
            />
        </group>
    )
}
 