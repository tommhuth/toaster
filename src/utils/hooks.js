import { useEffect, useState, useRef } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Mesh } from "three"

let loader = new GLTFLoader()
let cache = {}

export function useModel(url) {
    let [mesh, setMesh] = useState(() => {
        return cache[url] || new Mesh()
    })

    useEffect(() => {
        loader.load(url, (scene) => {
            let m = scene.scene.children[0]

            setMesh(m)
            cache[url] = m
        })
    }, [])

    return mesh
}

export function useDefaultValue(value) {
    let first = useRef(true)

    useEffect(() => {
        first.current = false
    }, [])

    return first.current ? value : undefined
}
