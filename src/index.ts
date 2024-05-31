// We define the empty imports so the auto-complete feature works as expected.
import { Vector3 } from '@dcl/sdk/math'
import { GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'

export function main() {
  // Defining behavior. See `src/systems.ts` file.
  //engine.addSystem(circularSystem)
  //engine.addSystem(changeColorSystem)

  // draw UI. Here is the logic to spawn cubes.
  //setupUi()

  let avocado = engine.addEntity()

  GltfContainer.create(avocado, {
		src: 'models/Avocado.glb',
	})

  Transform.create(avocado, {
		position: Vector3.create(3, 1, 3),
	})

  pointerEventsSystem.onPointerDown(
    {
      entity: avocado,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Collect' },
    },
    function () {
      console.log('CLICKED AVOCADO')
      engine.removeEntity(avocado)
    }
  )  
}
