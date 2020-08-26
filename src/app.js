import "../assets/styles/app.scss"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { Vector3, CameraHelper } from "three"
import Game from "./comps/Game"
import { useStore } from "./store"
import { softShadows } from "drei"
import { Suspense, useMemo, useEffect } from "react"
import { useLoader, useThree, useFrame } from "react-three-fiber"
import {
    SMAAImageLoader,
    BlendFunction,
    NoiseEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect,
    SSAOEffect,
    NormalPass,
    BloomEffect
} from "postprocessing"

softShadows({
    frustrum: 3.75, // Frustrum width (default: 3.75)
    size: 0.005, // World size (default: 0.005)
    near: 14.5, // Near plane (default: 9.5)
    samples: 17, // Samples (default: 17)
    rings: 11, // Rings (default: 11)
})

// Fix smaa loader signature
const _load = SMAAImageLoader.prototype.load

SMAAImageLoader.prototype.load = function (_, set) {
    return _load.bind(this)(set)
}

function Post1() {
    const { gl, scene, camera, size } = useThree()
    const smaa = useLoader(SMAAImageLoader)
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl)
        const smaaEffect = new SMAAEffect(...smaa)
        const noise = new NoiseEffect({ blendFunction: BlendFunction.MULTIPLY })

        composer.addPass(new RenderPass(scene, camera))

        smaaEffect.colorEdgesMaterial.setEdgeDetectionThreshold(0.1)
        noise.blendMode.opacity.value = .1

        const normalPass = new NormalPass(scene, camera)
        const ssaoEffect = new SSAOEffect(camera, normalPass.renderTarget.texture, {
            blendFunction: BlendFunction.OVERLAY,
            samples: 30,
            rings: 7,
            distanceThreshold: .65, // * camera z distance
            distanceFalloff: 0.05,  // fade out?
            rangeThreshold: 0.05,
            rangeFalloff: 0.01,
            luminanceInfluence: 0, // does lights affect the shadow 0 = no?
            radius: 20, // size of shadow itself
            resolutionScale: 1,
            scale: .75,
            bias: 0.05,
            fade: .1,
            intensity: 12, // strength of shadow
        })
        const bloom = new BloomEffect({
            intensity: 10,
            luminanceThreshold: .7,
            blendFunction: BlendFunction.LIGHTEN,
            luminanceSmoothing: .5
        })

        const effectPass = new EffectPass(
            camera,
            bloom,
            smaaEffect,
            ssaoEffect,
        )

        effectPass.renderToScreen = true
        composer.addPass(normalPass)
        composer.addPass(effectPass)

        return composer
    }, [])

    useEffect(() => composer.setSize(size.width, size.height), [size])

    return useFrame((context, delta) => composer.render(delta), 1)
}

function Ui() {
    let objects = useStore(i => i.data.objects)
    let state = useStore(i => i.data.state)

    return (
        <div className="ui">
            <p>objs: {objects}</p>
            <p>state: {state}</p>
        </div>
    )
}

ReactDOM.render(
    <>
        <Ui />
        <Canvas
            noEvents
            colorManagement
            shadowMap={true}
            orthographic
            pixelRatio={1}
            gl={{
                stencil: false,
                depth: false,
                alpha: false,
                antialias: false
            }}
            camera={{
                zoom: 45,
                fov: 75,
                near: -10,
                far: 50,
            }}
        >
            <Suspense fallback={null}>
                <Post1 />
            </Suspense>
            <ambientLight intensity={.3} color={0xffffff} />
            <Light />
            <Game />
        </Canvas>
    </>,
    document.getElementById("root")
)

function Light() {
    let ref = useRef()
    let { scene } = useThree()

    useEffect(() => {
        let h = new CameraHelper(ref.current.shadow.camera)

        console.log( ref.current)
    }, [])

    return (
        <directionalLight
            color={0xffffff}
            intensity={0.6}
            castShadow
            position={[-2, 4, 6]}
            ref={ref}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={20}
            shadow-bias={.0003}
            //shadow-normalBias={.1}
            shadow-camera-near={-20}
            shadow-camera-left={-15}
            shadow-camera-right={30}
            shadow-camera-top={25}
            shadow-camera-bottom={-10}
            onUpdate={(self) => {
                /*
                self.updateMatrixWorld()
                self.updateWorldMatrix()

                self.updateMatrixWorld()
                self.shadow.camera.updateMatrixWorld()
                self.shadow.camera.updateWorldMatrix()
                */
            }}
        />
    )
}