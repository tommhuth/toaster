import { MeshPhongMaterial } from "three"

const white = new MeshPhongMaterial({
    color: "#fff",
    emissive: "#99f",
    emissiveIntensity: .3,
    toneMapped: false
})
const blue = new MeshPhongMaterial({
    color: "#003cff",
    shininess: 10,
    emissive: "#00f",
    emissiveIntensity: .2,
    toneMapped: false
})

export { white, blue as groundMaterial }