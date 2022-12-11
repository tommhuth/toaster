import { useLoader } from "@react-three/fiber"
import { Quaternion, Vec3, Box as BoxShape } from "cannon-es"
import { useLayoutEffect, useMemo } from "react"
import { Euler, Line3, Matrix4, Mesh, Vector3, Quaternion as ThreeQuaternion } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import Config from "../../Config" 
import { Tuple3 } from "../../types"
import { ShapeDefinition, useInstancedBody } from "../../utils/cannon"
import { useOrientationObserver, useStageObjects } from "../../utils/hooks"
import { Only, setColorAt } from "../../utils/utils"
import { usePopulateLocations } from "./Boxes"
import InstancedMesh, { useInstance } from "../InstancedMesh"
import { white } from "../../utils/materials"
import StageObject from "../RidgidStageObject"
import RidgidStageObject from "../RidgidStageObject"
import { Chair, ObjectType } from "../../data/stages"

interface ChairProps {
    position: Tuple3
    rotation: Tuple3
}

function Chair({ position = [0, 0, 0], rotation = [0, 0, 0] }: ChairProps) {
    let height = 1.8
    let depth = 2.2
    let width = 2.75
    let definition = useMemo(() => {
        let thick1 = 0.15
        let thick2 = 0.25
        let aboveFloor = 1.75
        let thick = thick2 + thick1
        let legt = 0.15

        return [
            [
                new BoxShape(new Vec3(width / 2, thick / 2, depth / 2)),
                new Vec3(),
                new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), -0.1),
            ],
            [
                new BoxShape(new Vec3(width / 2, height / 2, thick / 2)),
                new Vec3(0, height / 2 - thick * 0.75, -depth / 2),
                new Quaternion().setFromAxisAngle(new Vec3(1, 0, 0), -0.1)
            ],
            [
                new BoxShape(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
                new Vec3(1, -aboveFloor / 2 + .1, -0.5 - 0.25),
                new Quaternion().setFromEuler(0.5, 0, 0.7, "ZYX")
            ],
            [
                new BoxShape(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
                new Vec3(1, -aboveFloor / 2 + .1, 0.5 - 0.25),
                new Quaternion().setFromEuler(-0.5, 0, 0.7, "ZYX")
            ],
            [
                new BoxShape(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
                new Vec3(-1, -aboveFloor / 2 + .1, -0.5 - 0.25),
                new Quaternion().setFromEuler(0.5, 0, -0.7, "ZYX")
            ],
            [

                new BoxShape(new Vec3(legt / 2, aboveFloor / 2, legt / 2)),
                new Vec3(-1, -aboveFloor / 2 + .1, 0.5 - 0.25),
                new Quaternion().setFromEuler(-0.5, 0, -0.7, "ZYX")
            ]
        ] as ShapeDefinition
    }, [])
    let [index, instance] = useInstance(ObjectType.CHAIR)
    let locations = useMemo(() => {
        let matrix = new Matrix4().compose(
            new Vector3(position[0], position[1] + height / 2, position[2]),
            new ThreeQuaternion().setFromEuler(new Euler().set(...rotation, "XYZ")),
            new Vector3(1, 1, 1),
        )

        return [
            {
                path: new Line3(
                    new Vector3(width / 2 * .85, .75, 0),
                    new Vector3(-width / 2 * .85, .75, 0)
                ).applyMatrix4(matrix),
                height: 2,
                depth: depth * .75
            },
        ]
    }, [])
    let [body] = useInstancedBody({
        definition,
        mass: 25,
        position: [position[0], position[1] + 1.5, position[2]],
        linearDamping: .25,
        rotation,
        index,
        instance,
    }) 

    usePopulateLocations(locations, rotation, [.5, .65])

    useLayoutEffect(() => {
        if (instance && index) {
            setColorAt(instance, index, "white")
        }
    }, [instance, index])

    return (
        <>
            <Only if={Config.DEBUG}>
                {locations.map(({ path, height, depth }, index) => {
                    let position = path.getCenter(new Vector3())

                    position.y += height / 2

                    return (
                        <mesh rotation-y={rotation[1]} position={position} key={index}>
                            <boxGeometry args={[path.distance(), height, depth, 1, 1, 1]} />
                            <meshLambertMaterial opacity={1} transparent color="red" />
                        </mesh>
                    )
                })}
            </Only>
            <RidgidStageObject body={body} />
        </>
    )
}

export default function Chairs() {
    let glb = useLoader(GLTFLoader, "/models/chair.glb")
    let mesh = glb?.scene.children[0] as Mesh
    let chairs = useStageObjects<Chair>(ObjectType.CHAIR)

    return (
        <>
            <InstancedMesh count={10} name={ObjectType.CHAIR}>
                <primitive attach="geometry" object={mesh?.geometry} />
                <primitive object={white}  attach="material"  />
            </InstancedMesh>
            {chairs.map(i => {
                return (
                    <Chair {...i} key={i.id} />
                )
            })}
        </>
    )
}