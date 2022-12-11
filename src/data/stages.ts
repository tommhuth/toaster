import { Tuple2, Tuple3 } from "../types"
import random from "@huth/random"

export interface BaseObject {
    type: ObjectType
    id: string
    position: Tuple3
    rotation: Tuple3
}

export enum ObjectType {
    SHELF = "shelf",
    TABLE = "table",
    GROUND = "ground",
    PLANT = "plant",
    TABLE_CHAIR = "table-chair",
    CABINET = "cabinet",
    CHAIR = "chair",
    BOX = "box"
}

export interface Shelf extends BaseObject {
    type: ObjectType.SHELF
}

export interface Chair extends BaseObject {
    type: ObjectType.CHAIR
}

export interface Cabinet extends BaseObject {
    type: ObjectType.CABINET
}

export interface Plant extends BaseObject {
    type: ObjectType.PLANT
}

export interface Table extends BaseObject {
    type: ObjectType.TABLE
}

export interface TableChair extends BaseObject {
    type: ObjectType.TABLE_CHAIR
}

export type StageObjects = TableChair | Table | Plant | Cabinet | Chair | Shelf

export interface Stage {
    objects: StageObjects[]
    title: string  
    ground: any[]
    settings: {
        center: Tuple3
        boundingBox: Tuple2
        movementZone: number
        timelimit?: number
    }
}

export const stages: Stage[] = [
    {
        title: "Söderhamn",
        settings: {
            center: [5, 0, 0],
            boundingBox: [25, 25],
            movementZone: 10,
        },
        ground: [
            {

                id: random.id(),
                position: [0, -25, 0],
                size: [100, 50, 100]
            },
            {

                id: random.id(),
                position: [5, .5, 0],
                size: [15, 1, 15]
            }
        ],
        objects: [
            {
                id: random.id(),
                type: ObjectType.PLANT,
                position: [11, 1, -5],
                rotation: [0, 1, 0],
            },
            {
                id: random.id(),
                type: ObjectType.CABINET,
                position: [9, 1, 7],
                rotation: [0, 0, 0]
            },
            {
                id: random.id(),
                type: ObjectType.CHAIR,
                position: [0, 1, -3],
                rotation: [0, .5, 0]
            },
            {
                id: random.id(),
                type: ObjectType.TABLE,
                position: [6, 1, 0],
                rotation: [0, .5, 0]
            },
            {
                id: random.id(),
                position: [6, 1, -4],
                type: ObjectType.TABLE_CHAIR,
                rotation: [0, -Math.PI, 0]
            },
            {
                id: random.id(),
                position: [0, 1, 4],
                type: ObjectType.SHELF,
                rotation: [0, Math.PI / 2, 0]
            },
        ]
    },
    {
        title: "Stockholm",
        settings: {
            center: [0, 0, 0],
            movementZone: 5,
            boundingBox: [35, 35],
            timelimit: 20
        },
        ground: [
            {

                id: random.id(),
                position: [0, -25, 0],
                size: [100, 50, 100]
            },
        ],
        objects: [
            {
                id: random.id(),
                type: ObjectType.PLANT,
                position: [6, 0, 4],
                rotation: [0, .2, 0],
            },
            {
                id: random.id(),
                position: [3, 0, -2],
                type: ObjectType.TABLE_CHAIR,
                rotation: [0, .15, 0]
            },
            {
                id: random.id(),
                position: [0, 0, 3],
                type: ObjectType.SHELF,
                rotation: [0, -Math.PI / 2, 0]
            },
        ]
    },
    {
        title: "Ivar",
        settings: {
            center: [0, 0, 0],
            boundingBox: [40, 40],
            movementZone: 10,
        },
        ground: [
            ...new Array(6).fill(null).map((i, index, list) => {
                let stepDepth = 3
                let depth = index === list.length - 1 ? 100 : stepDepth
                let height = 1 

                return {
                    id: random.id(),
                    position: [
                        0,
                        index * height / 2,
                        index * stepDepth / 2 + 5 + depth / 2
                    ],
                    size: [100, height, depth]
                }
            }),
            {
                id: random.id(),
                position: [0, -5, 0],
                size: [100, 10, 10]
            },
            ...new Array(16).fill(null).map((i, index, list) => {
                let stepDepth = 3
                let depth = index === list.length - 1 ? 100 : stepDepth
                let height = 1

                return {
                    id: random.id(),
                    position: [
                        0,
                        -index * height / 2 - height,
                        -index * stepDepth / 2 - 5
                    ],
                    size: [100, height, depth]
                }
            }),
        ],
        objects: [
            {
                id: random.id(),
                type: ObjectType.SHELF,
                position: [-5, 0, 0],
                rotation: [0, Math.PI/2, 0],
            },
            {
                id: random.id(),
                type: ObjectType.SHELF,
                position: [7, 0, 0],
                rotation: [0, 0, 0],
            },
            {
                id: random.id(),
                type: ObjectType.CHAIR,
                position: [0, 0, 0],
                rotation: [0, -Math.PI + .3, 0],
            },
        ]
    },
]