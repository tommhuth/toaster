import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Group, Vector3 } from "three"
import { Body } from "../utils/cannon"
import { useOrientationObserver } from "../utils/hooks"
import { Html } from "@react-three/drei" 

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
                <div
                    style={{
                        fontSize: "1.85em",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 900,
                        padding: ".25em .5em",
                        border: ".15em solid white", 
                        animation: dead ? "msg 2s both" : undefined,
                        visibility: !dead ? "hidden" : undefined, 
                        color: "white", 
                    }}
                > 
                    &minus;750
                </div>
            </Html>
        </group>
    )
}