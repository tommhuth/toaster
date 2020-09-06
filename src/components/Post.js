import {  useMemo, useEffect } from "react"
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
        const noise = new NoiseEffect({ blendFunction: BlendFunction.MULTIPLY })

        composer.addPass(new RenderPass(scene, camera))

        smaaEffect.colorEdgesMaterial.setEdgeDetectionThreshold(0.1)
        noise.blendMode.opacity.value = .1

        const normalPass = new NormalPass(scene, camera)
        const ssaoEffect = new SSAOEffect(camera, normalPass.renderTarget.texture, {
            blendFunction: BlendFunction.OVERLAY,
            samples: 30,
            rings: 7,
            distanceThreshold: .55, // * camera z distance
            distanceFalloff: 0.05,  // fade out?
            rangeThreshold: 0.05,
            rangeFalloff: 0.01,
            luminanceInfluence: 0, // does lights affect the shadow 0 = no?
            radius: 20, // size of shadow itself
            resolutionScale: 1,
            scale: .75,
            bias: 0.05,
            fade: .1,
            intensity: 11, // strength of shadow
        })
        const bloom = new BloomEffect({
            intensity: 10,
            luminanceThreshold: .7,
            blendFunction: BlendFunction.LIGHTEN,
            luminanceSmoothing: .5
        })

        const effectPass = new EffectPass(
            camera,
            //smaaEffect,
            //ssaoEffect,
            bloom,
        )

        effectPass.renderToScreen = true
        composer.addPass(normalPass)
        composer.addPass(effectPass)

        return composer
    }, [])

    useEffect(() => composer.setSize(size.width, size.height), [size])

    return useFrame((context, delta) => composer.render(delta), 1)
}
 