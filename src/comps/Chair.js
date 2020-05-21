import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3, Quaternion, Cylinder } from "cannon"
import { useFrame } from "react-three-fiber"
import { v4 } from "uuid"
import Obj from "./Obj"
import { useStore } from "../store"

export default function Chair({
    x = 0,
    z = 0,
    y = 0,
    height = 1.8,
    depth = 2.2,
    width = 2.5,
    rotation = .5,
    untouchable = false,
}) {
    let aboveFloor = 1.75
    let { ref, body } = useCannon({
        position: [x, y + aboveFloor, z],
        mass: 16, 
        userData: { chair: true, untouchable },
    })

    useEffect(() => {
        let quat = new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), -0.1)
        let quat2 = new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)

        body.addShape(new Box(new Vec3(width / 2, 0.125, depth / 2)), new Vec3(), quat)
        body.addShape(
            new Box(new Vec3(width / 2, height / 2, 0.125)),
            new Vec3(0, height / 2 - 0.235, -depth / 2),
            quat
        )
        body.addShape(new Cylinder(1.25, 0.35, aboveFloor, 6), new Vec3(0, -0.75, 0), quat2)

        body.quaternion.setFromAxisAngle(new Vec3(0,1,0), rotation)
    }, [])

    return (
        <group ref={ref}>
            <mesh position={[0, 0, 0]} rotation-x={-0.1}>
                <boxBufferGeometry args={[width, 0.25, depth]} attach="geometry" />
                <meshLambertMaterial color="#ffffff" attach="material" />
            </mesh>
            <mesh position={[0, height / 2 - 0.235, -depth / 2]} rotation-x={-0.1}>
                <boxBufferGeometry args={[width, height, 0.25]} attach="geometry" />
                <meshLambertMaterial color="#ffffff" attach="material" />
            </mesh>

            <group position={[0, -aboveFloor / 2 + 0.2, 0]} rotation-y={0.85}>
                <mesh position={[0.75, 0, 0]} rotation-z={0.45}>
                    <boxBufferGeometry args={[0.125, aboveFloor, 0.125]} attach="geometry" />
                    <meshLambertMaterial color="#ffffff" attach="material" />
                </mesh>
            </group>
            <group position={[0, -aboveFloor / 2 + 0.2, 0]} rotation-y={-0.85}>
                <mesh position={[0.75, 0, 0]} rotation-z={0.45}>
                    <boxBufferGeometry args={[0.125, aboveFloor, 0.125]} attach="geometry" />
                    <meshLambertMaterial color="#ffffff" attach="material" />
                </mesh>
            </group>

            <group position={[0, -aboveFloor / 2 + 0.2, 0]} rotation-y={0.85}>
                <mesh position={[-0.75, 0, 0]} rotation-z={-0.45}>
                    <boxBufferGeometry args={[0.125, aboveFloor, 0.125]} attach="geometry" />
                    <meshLambertMaterial color="#ffffff" attach="material" />
                </mesh>
            </group>
            <group position={[0, -aboveFloor / 2 + 0.2, 0]} rotation-y={-0.85}>
                <mesh position={[-0.75, 0, 0]} rotation-z={-0.45}>
                    <boxBufferGeometry args={[0.125, aboveFloor, 0.125]} attach="geometry" />
                    <meshLambertMaterial color="#ffffff" attach="material" />
                </mesh>
            </group>
        </group>
    )
}
