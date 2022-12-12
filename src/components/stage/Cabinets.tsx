import { Vec3, Box as BoxShape } from "cannon-es"
import { useLayoutEffect, useMemo } from "react"
import { Euler, Line3, Matrix4, Quaternion, Vector3 } from "three"
import { Tuple3 } from "../../types"
import { ShapeDefinition, useInstancedBody } from "../../utils/cannon"
import { Only, setColorAt } from "../../utils/utils"
import { useInstance } from "..//InstancedMesh"
import { usePopulateLocations } from "./Boxes"
import Config from "../../Config"
import { useStageObjects } from "../../utils/hooks"
import RidgidStageObject from "../RidgidStageObject"
import { Cabinet, ObjectType } from "../../data/stages"

interface CabinetProps {
    rotation: Tuple3;
    position: Tuple3;
} 

function Cabinet({ position = [0, 0, 0], rotation = [0, 0, 0] }: CabinetProps) {
    let innerSize = 0.125
    let outerSize = 0.25
    let width = 5
    let height = 3
    let depth = 2.5
    let [index, instance] = useInstance(ObjectType.CABINET) 
    let definition = useMemo(() => {
        return [
            // bottom
            [
                new BoxShape(new Vec3(width / 2, outerSize / 2, depth / 2)),
                new Vec3(0, -height / 2, 0)
            ],
            // top
            [
                new BoxShape(new Vec3(width / 2, outerSize / 2, depth / 2)),
                new Vec3(0, height / 2, 0)
            ],
            // middle
            [
                new BoxShape(new Vec3(width / 2, innerSize / 2, depth / 2 - innerSize)),
                new Vec3(0, 0, -innerSize)
            ],
            // left
            [
                new BoxShape(new Vec3(outerSize / 2, height / 2, depth / 2)),
                new Vec3(-width / 2 + outerSize / 2, 0, 0)
            ],
            // right
            [
                new BoxShape(new Vec3(outerSize / 2, height / 2, depth / 2)),
                new Vec3(width / 2 - outerSize / 2, 0, 0)
            ]
        ] as ShapeDefinition
    }, [])
    let locations = useMemo(() => {
        let matrix = new Matrix4().compose(
            new Vector3(position[0], position[1] + height / 2, position[2]),
            new Quaternion().setFromEuler(new Euler().set(...rotation, "XYZ")),
            new Vector3(1, 1, 1),
        )

        return [
            {
                path: new Line3(
                    new Vector3(width / 2 - outerSize * 2 - .1, -height / 2 + outerSize, 0),
                    new Vector3(-width / 2 + outerSize * 2 + .1, -height / 2 + outerSize, 0)
                ).applyMatrix4(matrix),
                height: height / 2 - outerSize - .2,
                depth: depth * .86,
            },
            {
                path: new Line3(
                    new Vector3(width / 2 - outerSize * 2 - .1, .25, 0),
                    new Vector3(-width / 2 + outerSize * 2 + .1, .25, 0)
                ).applyMatrix4(matrix),
                height: height / 2 - outerSize - .35,
                depth: depth * .85,
            },
            {
                path: new Line3(
                    new Vector3(width / 2 - .15, height / 2 + outerSize, 0),
                    new Vector3(-width / 2 + .15, height / 2 + outerSize, 0)
                ).applyMatrix4(matrix),
                height: 4,
                depth: depth * .9,
            },
        ]
    }, [])
    let [body] = useInstancedBody({
        definition,
        position: [position[0], position[1] + height / 2 + outerSize / 2, position[2]],
        mass: 25,
        rotation,
        instance,
        index,
    })

    usePopulateLocations(locations, rotation, [.3, .6])

    useLayoutEffect(() => {
        if (index && instance?.instanceColor) {
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
                            <meshLambertMaterial opacity={.5} transparent color="red" />
                        </mesh>
                    )
                })}
            </Only>
            <RidgidStageObject body={body} />
        </>
    )
}

export default function Cabinets() { 
    let cabinets = useStageObjects<Cabinet>(ObjectType.CABINET)

    return (
        <>   
            {cabinets.map(i => {
                return <Cabinet {...i} key={i.id} />
            })}
        </>
    )
}