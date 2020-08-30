import { useEffect, useState, useRef } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { BufferGeometry } from "three"

let loader = new GLTFLoader()
let cache = {}

export function useGeometry(name) {
    let [geometry, setGeometry] = useState(() => cache[name] || new BufferGeometry())

    useEffect(() => {
        if (!cache[name]) { 
            loader.load(`/models/${name}.glb`, (res) => {
                let mesh = res.scene.children.find(i => i.name = name)

                setGeometry(mesh.geometry)
                cache[name] = mesh.geometry
            }, undefined, console.error)
        }
    }, [name])

    return geometry
}


export function useDefaultValue(value) {
    let first = useRef(true)

    useEffect(() => {
        first.current = false
    }, [])

    return first.current ? value : undefined
}
