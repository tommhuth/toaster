import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { setInstance, store, useStore } from "../data/store"
import { setMatrixAt, setMatrixNullAt } from "../utils/utils"
import { InstancedMesh as ThreeInstancedMesh } from "three"

export function useInstance(name: string) {
    let instance = useStore(i => i.instances[name])
    let [index, setIndex] = useState<null | number>(null)

    useEffect(() => {
        if (instance && !index) {
            setIndex(instance.index.next())
        }
    }, [instance, index])

    return [index, instance?.mesh] as const
}

export default function InstancedMesh({ children, count, name, userData = {},  }) {  
    let ref = useCallback((mesh: ThreeInstancedMesh) => {
        if (mesh) {
            for (let i = 0; i < count; i++){
                setMatrixNullAt(mesh, i)
            }

            setInstance(name, mesh, count)
        }
    }, []) 

    return (
        <instancedMesh
            args={[undefined, undefined, count]}
            castShadow
            userData={{ ...userData, type: name }}
            receiveShadow
            frustumCulled={ false}
            ref={ref} 
        > 
            {children}
        </instancedMesh>
    )
}