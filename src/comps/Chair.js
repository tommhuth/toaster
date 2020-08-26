import React, { useEffect, useState } from "react"
import { useCannon } from "../utils/cannon"
import { Box, Vec3, Quaternion, Cylinder } from "cannon"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { BufferGeometry } from "three"
 

export function useGeometry(name) {
    let [geometry, setGeometry] = useState(() => new BufferGeometry())

    useEffect(() => {
        let loader = new GLTFLoader()

        loader.load(`/models/${name}.glb`, (res) => {
            let mesh = res.scene.children.find(i => i.name = name)

            setGeometry(mesh.geometry)  
        }, undefined, console.error)
    }, [name])

    return geometry
}

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
    let aboveFloor = 1.75
    let geometry = useGeometry("chair")
    let { ref, body } = useCannon({
        position: [x, y + aboveFloor, z],
        mass: 16,
        userData: { chair: true, untouchable },
    })

    useEffect(() => {
        let thick1 = 0.15
        let thick2 = 0.25
        let thick = thick2 + thick1
        let legt = 0.15
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
            new Vec3(1, -aboveFloor / 2 + .1, -0.5 - 0.25),
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
            new Vec3(-1, -aboveFloor / 2 + .1, 0.5 - 0.25),
            new Quaternion().setFromEuler(-0.5, 0, -0.7, "ZYX")
        )

        body.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), rotation)
    }, [])

    useEffect(() => {
    }, [])

    return (
        <mesh receiveShadow castShadow ref={ref} geometry={geometry}>
            <meshLambertMaterial color={0xffffff} attach="material" />
        </mesh>
    )
}
