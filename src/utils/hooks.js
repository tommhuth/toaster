import { useEffect, useRef } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

const loader = new GLTFLoader()
const cache = new Map()

function fetchModel(name) {
    return new Promise((resolve, reject) => {
        if (cache.has(name)) {
            return resolve(cache.get(name))
        }

        loader.load(`/models/${name}.glb`, (res) => {
            let { geometry } = res.scene.children.find(i => i.name = name)

            resolve(geometry)
            cache.set(name, geometry)
        }, undefined, reject)
    })
}

export function resource(name) {
    let data
    let status = "init"
    let error
    let promise = fetchModel(name)
        .then(model => {
            data = model
            status = "done"
        })
        .catch(e => {
            error = e
            status = "error"
        })

    return () => {
        if (status === "init") {
            throw promise
        } else if (status === "error") {
            throw error
        } else {
            return data
        }
    }
}

export function useAsyncModel(reader) {
    return reader()
}

export function useDefaultValue(value) {
    let first = useRef(true)

    useEffect(() => {
        first.current = false
    }, [])

    return first.current ? value : undefined
}

const useAnimationFrame = callback => {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef =  useRef()
    const previousTimeRef = useRef()

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current

            callback(deltaTime)
        }
        previousTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(requestRef.current)
    }, []) // Make sure the effect runs only once
}

export {useAnimationFrame}