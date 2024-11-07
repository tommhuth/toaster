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
    id: string;
    ground: any[]
    settings: {
        center: Tuple3
        boundingBox: Tuple2 
        timelimit?: number
        exitY?: number
        background?: string
    }
}


export const stages: Stage[] = [
    {
        title: "Söderhamn",
        id: random.id(),
        settings: {
            center: [5, 0, 0],
            boundingBox: [25, 25], 
            background:  "rgb(12,62,203)"
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
                size: [20, 1, 21]
            }
        ],
        objects: [
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
                rotation: [0, 1.5, 0]
            },
            {
                id: random.id(),
                type: ObjectType.PLANT,
                position: [4.5, 1, 7],
                rotation: [0, 1, 0],
            },
            {
                id: random.id(),
                type: ObjectType.TABLE,
                position: [7, 1, -2],
                rotation: [0, .5, 0]
            },
            {
                id: random.id(),
                position: [7, 1, -6],
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
        id: random.id(),
        settings: {
            center: [0, 0, 0], 
            boundingBox: [35, 35],
            background:  "rgb(12,62,203)"
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
        title: "Kungsbacka",
        id: random.id(),
        settings: {
            center: [0, 0, 5], 
            boundingBox: [30, 40], 
            exitY: -2,
        },
        ground: [
            { 
                id: random.id(),
                position: [0, -50, -10],
                size: [10, 100, 30]
            },
            { 
                id: random.id(),
                position: [0, -50, 11],
                size: [10, 100, 4]
            },
            { 
                id: random.id(),
                position: [0, -50, 19],
                size: [10, 100, 4]
            },
        ],
        objects: [
            {
                id: random.id(),
                type: ObjectType.SHELF,
                position: [0, 0, 3],
                rotation: [0, 0, 0],
            },  
            {
                id: random.id(),
                type: ObjectType.SHELF,
                position: [0, 0, 11],
                rotation: [0, 0, 0],
            },  
            {
                id: random.id(),
                type: ObjectType.PLANT,
                position: [-1, 0, 19],
                rotation: [0, 0, 0],
            },   
            {
                id: random.id(),
                type: ObjectType.CHAIR,
                position: [3, 0, 19],
                rotation: [0, 1.85, 0],
            },   
        ]
    },
    {
        title: "Äpplarö",
        id: random.id(),
        settings: {
            center: [0, 0, 0],
            boundingBox: [40, 40], 
            background:  "rgb(12,62,203)"
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
                        index * stepDepth / 2 + 8 + depth / 2
                    ],
                    size: [100, height, depth]
                }
            }),
            {
                id: random.id(),
                position: [0, -5, 0],
                size: [100, 10, 16]
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
                        -index * stepDepth / 2 - 8
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