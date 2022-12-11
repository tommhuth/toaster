import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Group, Vector3 } from "three"
import { Body } from "../utils/cannon"
import { useOrientationObserver } from "../utils/hooks"
import { Html } from "@react-three/drei"
import { Only } from "../utils/utils"

export default function RidgidStageObject({ body }: { body: Body }) {
    let ref = useRef<Group>(null)
    let dead = useOrientationObserver(body)

    useFrame(() => {
        if (ref.current && !dead) {
            ref.current.position.copy(body.position as unknown as Vector3)
        }
    })

    return ( 
        <group ref={ref}>
            <Html as="div" center >
                <h1
                    style={{
                        fontSize: "1.5em",
                        fontFamily: "Arial",
                        padding: ".75em 1.5em",
                        opacity: dead ? 0 : 1,
                        transform: `translateY(${dead ? -4 : 0}em)`,
                        transition: "all .5s ease-out",
                        transitionDelay: dead ? "0s" : "5s",
                        visibility: !dead ? "hidden" : undefined,
                        borderRadius: "5em",
                        backgroundColor: "#ff008c",
                        color: "white"
                    }}
                >
                    <Only if={dead}>
                        -10
                    </Only>
                </h1>
            </Html>
        </group>
    )
}