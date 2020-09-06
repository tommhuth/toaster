import {  useMemo, useEffect } from "react"
import { useLoader, useThree, useFrame } from "react-three-fiber" 
import {
    SMAAImageLoader,
    BlendFunction, 
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect, 
    BloomEffect,
    KernelSize
} from "postprocessing"
 

// Fix smaa loader signature
const _load = SMAAImageLoader.prototype.load

SMAAImageLoader.prototype.load = function (_, set) {
    return _load.bind(this)(set)
}

export default function Post1() {
    const { gl, scene, camera, size } = useThree()
    const smaa = useLoader(SMAAImageLoader)
    const composer = useMemo(() => {
        const composer = new EffectComposer(gl)
        const smaaEffect = new SMAAEffect(...smaa) 

        composer.addPass(new RenderPass(scene, camera))

        smaaEffect.colorEdgesMaterial.setEdgeDetectionThreshold(0.1) 
 
        const bloom = new BloomEffect({
            intensity: .0751, 
            luminanceThreshold: .1,  
            blendFunction: BlendFunction.SCREEN,
            luminanceSmoothing: .5
        }) 

        bloom.blurPass.scale = 1
        bloom.blurPass.kernelSize = KernelSize.LARGE
        bloom.resolution.height = 480

        const effectPass = new EffectPass(
            camera,
            smaaEffect,
            bloom, 
        )

        effectPass.renderToScreen = true 
        composer.addPass(effectPass)

        return composer
    }, [])

    useEffect(() => composer.setSize(size.width, size.height), [size])

    return useFrame((context, delta) => composer.render(delta), 1)
}
 