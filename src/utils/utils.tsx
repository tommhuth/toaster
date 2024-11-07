import { createContext } from "react"
import { Color, ColorRepresentation, Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from "three"
import { Tuple3, Tuple4 } from "../types"

export function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2)
}

export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
}

export function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2
}

// https://gist.github.com/xposedbones/75ebaef3c10060a3ee3b246166caab56
export function map(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

export function Only(props) {
    return props.if ? <>{props.children}</> : null
}

// Source: https://medium.com/@Heydon/managing-heading-levels-in-design-systems-18be9a746fa3
const Level = createContext(1)

export function Section({ children }) {
    return (
        <Level.Consumer>
            {level => <Level.Provider value={level + 1}>{children}</Level.Provider>}
        </Level.Consumer>
    )
}

export function clampDelta(delta: number) {
    return clamp(delta, 1 / 120, 1 / 30)
}

export function Heading(props) {
    return (
        <Level.Consumer>
            {level => {
                const Component = `h${Math.min(level, 6)}`

                return <Component {...props} />
            }}
        </Level.Consumer>
    )
}

export function glsl(strings, ...variables) {
    let str: string[] = []

    strings.forEach((x, i) => {
        str.push(x)
        str.push(variables[i] || "")
    })

    return str.join("")
}


let _matrix = new Matrix4()
let _quaternion = new Quaternion()
let _position = new Vector3(0, 0, 0)
let _scale = new Vector3(1, 1, 1)
let _euler = new Euler()

interface SetMatrixAtParams {
    instance: InstancedMesh
    index: number
    position?: Tuple3
    rotation?: Tuple3 | Tuple4
    scale?: Tuple3
}

export function setMatrixAt({
    instance,
    index,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
}: SetMatrixAtParams) {
    instance.setMatrixAt(
        index,
        _matrix.compose(
            _position.set(...position),
            rotation.length === 3 ? _quaternion.setFromEuler(_euler.set(...rotation)) : _quaternion.set(...rotation),
            _scale.set(...scale)
        )
    )
    instance.instanceMatrix.needsUpdate = true
    instance.computeBoundingBox()
    instance.computeBoundingSphere()
    instance.geometry.computeBoundingBox()
    instance.geometry.computeBoundingSphere()
}

export function setMatrixNullAt(instance: InstancedMesh, index: number) {
    setMatrixAt({
        instance,
        index,
        position: [0, 0, -1_000],
        scale: [1, 1, 1],
        rotation: [0, 0, 0]
    })
}

const _color = new Color()

export function setColorAt(instance: InstancedMesh, index: number, color: ColorRepresentation) {
    instance.setColorAt(index, _color.set(color))

    if (instance.instanceColor) {
        instance.instanceColor.needsUpdate = true
    }
}

export function snap(value: number, range: number[]) {
    let result = Infinity

    for (let val of range) {
        if (val - value < result) {
            result = val
        }
    }

    return result
}

export function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3

    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}