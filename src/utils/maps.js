export default [
    {
        name: "intro",
        slug: "intro",
        launcherPosition: [14, .1, 14], 
        camera: {
            preplaying: [15, 10, 5],
            playing: [10, 10, 10]
        },
        world: [
        ],
        objects: [
            { 
                width: 5,
                height: 2,
                depth: 2,
                x: 0,
                z: 1,
                y: 1,
                rotation: 2
            }
        ],
        elements: [
            {
                type: "shelf",
                x: 0,
                z: 5,
            },
            {
                type: "bowl",
                x: 4.5,
                z: 1,
            },
            {
                type: "chair",
                z: 4,
                x: 5.25,
                rotation: .7,
                untouchable: true
            },
        ]
    },
    {
        name: "Something with a wall",
        slug: "wall", 
        camera: {
            preplaying: [15, 10, 5], 
            playing: [10, 10, 10]
        },
        world: [
            {
                height: 10,
                width: 7,
                depth: 7,
                x: -0,
                y: 5,
                z: -0
            }
        ],
        elements: [
            {
                type: "shelf",
                x: 0,
                z: 5,
            },
            {
                type: "chair",
                z: 0,
                x: 5.25,
                rotation: 1.4,
                untouchable: true
            },
        ]
    },
    {
        name: "Everyone",
        slug: "everyone", 
        camera: {
            preplaying: [15, 10, 5],
            playing: [10, 10, 10]
        },
        world: [
        ],
        elements: [
            {
                type: "shelf",
                x: 5,
                z: 0,
                rotated: true
            },
            {
                type: "shelf",
                x: -5,
                z: 0,
                rotated: false
            },
            {
                type: "short-shelf",
                x: 5,
                z: 10,
                rotated: false
            },
            {
                type: "bowl",
                x: 10,
                z: 10,
                rotated: false,
                untouchable: true
            },
            {
                type: "short-shelf",
                x: -2,
                z: -10,
                rotated: false
            },
        ]
    },
    {
        name: "The Arrow",
        slug: "the-arrow",  
        camera: {
            preplaying: [20, 10, 5],
            playing: [10, 10, 5]
        },
        world: [
            {
                height: 4,
                width: 1,
                depth: 8,
                x: 4,
                y: 2,
                z: 0
            }
        ],
        elements: [
            {
                type: "shelf",
                x: -6,
                z: 0,
            },
            {
                type: "shelf",
                x: 0,
                z: 0,
            },
            {
                type: "short-shelf",
                x: 5.75,
                z: 0,
                rotated: true
            },
            {
                type: "bowl",
                z: -5,
                x: -3
            },
        ]
    }
]


const initialMap = { 
    name: "heyo",
    slug: "hey",
    zoom: 45, 
    camera: {
        preplaying: [0, 10, -5],
        playing: [15, 10, 5]
    },
    world: [ 
    ],
    /*
    elements: [
        {
            type: "shelf",
            x: 0,
            z: 1,
            y: 0,
            rotated: true
        }, 
        {
            type: "chair",
            z: 1,
            y: 2,
            x: 4,
            rotation: .86, 
        },
        {
            type: "bowl",
            z: 4,
            y: 1,
            x: -0,  
        },
    ],
    */
    elements: []
}

export {initialMap}