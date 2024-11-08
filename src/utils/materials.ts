import { MeshLambertMaterial } from "three"

const white = new MeshLambertMaterial({
    color: "#fff",
    emissive: "rgb(159, 193, 255)",
    emissiveIntensity: .4,
    toneMapped: false
})

const blue = new MeshLambertMaterial({
    color: "#003cff", 
    emissive: "#00f",
    emissiveIntensity: .2,
    toneMapped: false
})

const yellow = new MeshLambertMaterial({
    color: "#ffff00", 
    emissive: "#f00",
    emissiveIntensity: .35,
    toneMapped: false
})

export { white, blue, yellow } 