import { Vec3, Box as BoxShape } from "cannon-es"
import { useLayoutEffect, useMemo } from "react"
import { Euler, Line3, Matrix4, Vector3, Quaternion as ThreeQuaternion } from "three"
import Config from "../../Config" 
import { Tuple3 } from "../../types"
import { ShapeDefinition, useInstancedBody } from "../../utils/cannon"
import { useOrientationObserver, useStageObjects } from "../../utils/hooks"
import { Only, setColorAt } from "../../utils/utils"
import { usePopulateLocations } from "./Boxes"
import { useInstance } from "..//InstancedMesh"
import RidgidStageObject from "../RidgidStageObject"
import { ObjectType, Table } from "../../data/stages"

interface TableProps {
    position: Tuple3
    rotation: Tuple3
}

function Table({ position = [0, 0, 0], rotation = [0, 0, 0] }: TableProps) {
    let width = 8
    let thickness = .3
    let height = 3
    let depth = 5
    let inset = .4
    let definition = useMemo(() => {
        const legs = [
            [width / 2 - inset, depth / 2 - inset],
            [-width / 2 + inset, depth / 2 - inset],
            [-width / 2 + inset, -depth / 2 + inset],
            [width / 2 - inset, -depth / 2 + inset]
        ]

        return [
            [
                new BoxShape(new Vec3(width / 2, thickness / 2, depth / 2)),
                new Vec3(0, thickness / 2, 0),
            ],
            ...legs.map(([x, z]) => {
                return [
                    new BoxShape(new Vec3(thickness / 2, height / 2, thickness / 2)),
                    new Vec3(x, -height / 2, z),
                ]
            })
        ] as ShapeDefinition
    }, [])
    let [index, instance] = useInstance(ObjectType.TABLE)
    let locations = useMemo(() => {
        let matrix = new Matrix4().compose(
            new Vector3(position[0], position[1] + height + thickness, position[2]),
            new ThreeQuaternion().setFromEuler(new Euler().set(...rotation, "XYZ")),
            new Vector3(1, 1, 1),
        )

        return [
            {
                path: new Line3(
                    new Vector3(width / 2 * .85, 0, 0),
                    new Vector3(-width / 2 * .85, 0, 0)
                ).applyMatrix4(matrix),
                height: 4,
                depth: depth * .75
            },
        ]
    }, [])
    let [body] = useInstancedBody({
        definition,
        mass: 20,
        position: [position[0], position[1] + height, position[2]],
        linearDamping: .25,
        rotation,
        index,
        instance,
    })

    useOrientationObserver(body)

    usePopulateLocations(locations, rotation, [.25, .4], [.2, .35])


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
                            <meshLambertMaterial opacity={.5} transparent color="red" />
                        </mesh>
                    )
                })}
            </Only>

            <RidgidStageObject body={body} />
        </>
    )
}

export default function Tables() { 
    let tables = useStageObjects<Table>(ObjectType.TABLE)

    return (
        <> 
            {tables.map(i => {
                return (
                    <Table {...i} key={i.id} />
                )
            })}
        </>
    )
}