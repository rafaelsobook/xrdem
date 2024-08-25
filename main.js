import { Engine } from "@babylonjs/core"
import { createScene } from "./createScene.js"

const engine = new Engine(document.querySelector("canvas"))

async function main() {
  const scene = await createScene()
  engine.runRenderLoop(() => {
    scene.render()
  })
}
main()
