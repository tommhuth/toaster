import { Vec3, Box as BoxShape } from "cannon-es"
import { useLayoutEffect, useMemo } from "react"
import { Euler, Line3, Matrix4, Quaternion, Vector3 } from "three"
import { Tuple3 } from "../../types"
import { ShapeDefinition, useInstancedBody } from "../../utils/cannon"
import { useStageObjects } from "../../utils/hooks"
import { setColorAt } from "../../utils/utils"
import { usePopulateLocations } from "./Boxes"
import { useInstance } from "../InstancedMesh"
import RidgidStageObject from "../RidgidStageObject"
import { ObjectType, TableChair } from "../../data/stages"

interface ChairProps {
    position: Tuple3
    rotation: Tuple3
}

function TableChair({ position = [0, 0, 0], rotation = [0, 0, 0] }: ChairProps) {
    let width = 2
    let seatHeight = 1.75
    let depth = 2
    let thickness = .225
    let inset = thickness / 2
    let definition = useMemo(() => {
        const legs = [
            [width / 2 - inset, depth / 2 - inset],
            [-width / 2 + inset, depth / 2 - inset],
            [-width / 2 + inset, -depth / 2 + inset],
            [width / 2 - inset, -depth / 2 + inset]
        ]
        const back = [
            [width / 2 - inset, depth / 2 - inset],
            [-width / 2 + inset, depth / 2 - inset],
        ]

        return [
            [
                new BoxShape(new Vec3(width / 2, thickness / 2, depth / 2)),
                new Vec3(0, thickness / 2, 0),
            ],
            ...legs.map(([x, z]) => {
                return [
                    new BoxShape(new Vec3(thickness / 2, seatHeight / 2, thickness / 2)),
                    new Vec3(x, -seatHeight / 2, z),
                ]
            }),
            [
                new BoxShape(new Vec3(width / 2, seatHeight / 4, thickness / 2)),
                new Vec3(0, seatHeight + thickness - seatHeight / 4, depth / 2 - thickness / 2),
            ],
            ...back.map(([x, z]) => {
                return [
                    new BoxShape(new Vec3(thickness / 2, seatHeight / 2, thickness / 2)),
                    new Vec3(x, seatHeight / 2 + thickness, z),
                ]
            })
        ] as ShapeDefinition
    }, [])
    let [index, instance] = useInstance(ObjectType.TABLE_CHAIR)
    let locations = useMemo(() => {
        let matrix = new Matrix4().compose(
            new Vector3(position[0], position[1] + thickness + seatHeight, position[2]),
            new Quaternion().setFromEuler(new Euler().set(...rotation, "XYZ")),
            new Vector3(1, 1, 1),
        )

        return [
            {
                path: new Line3(
                    new Vector3(width / 2, 0, 0),
                    new Vector3(-width / 2, 0, 0)
                ).applyMatrix4(matrix),
                height: 3,
                depth: depth * .75
            },
        ]
    }, [])
    let [body] = useInstancedBody({
        definition,
        mass: 10,
        position: [position[0], position[1] + seatHeight, position[2]],
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

        <RidgidStageObject body={body} />
    )
}

export default function TableChairs() {
    let tableChairs = useStageObjects<TableChair>(ObjectType.TABLE_CHAIR)

    return (
        <>
            {tableChairs.map(i => {
                return (
                    <TableChair {...i} key={i.id} />
                )
            })}
        </>
    )
}