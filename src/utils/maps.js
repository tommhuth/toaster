export default [
    {
        name: "intro",
        slug: "intro",
        launcherPosition: [14, .1, 14],
        world: [
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
        launcherPosition: [14, .1, 14],
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
        launcherPosition: [10, .1, 10],
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
        launcherPosition: [0, .1, 14],
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