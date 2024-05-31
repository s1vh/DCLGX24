// We define the empty imports so the auto-complete feature works as expected.
import { engine, Transform, GltfContainer, PointerEventType, pointerEventsSystem, Entity, InputAction } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'
import { init } from './game'

export function main() {
  // Load models
  const PIN_MODEL_PATH = "models/avocado.glb";
  const BALL_MODEL_PATH = "models/avocado.glb";

  // Create a bowling pin
  function createPin(position: { x: number, y: number, z: number }): Entity {
    const pin = engine.addEntity();
    GltfContainer.create(pin, { src: PIN_MODEL_PATH });
    Transform.create(pin, { position: Vector3.create(position.x, position.y, position.z) });
    return pin;
  }

  // Create pins in a triangular formation
  const pinPositions = [
    { x: 8, y: 0, z: 12 },
    { x: 7.5, y: 0, z: 12.5 },
    { x: 8.5, y: 0, z: 12.5 },
    { x: 7, y: 0, z: 13 },
    { x: 8, y: 0, z: 13 },
    { x: 9, y: 0, z: 13 }
  ];

  const pinEntities = pinPositions.map(pos => createPin(pos));

  // Create a bowling ball
  const ball = engine.addEntity();
  GltfContainer.create(ball, { src: BALL_MODEL_PATH });
  Transform.create(ball, {
    position: Vector3.create(8, 0, 1),
    rotation: Quaternion.fromEulerDegrees(0, 0, 0),
    scale: Vector3.create(0.5, 0.5, 0.5)
  });

  // Add pointer event to move the ball
  pointerEventsSystem.onPointerDown(
    {
      entity: ball,
      opts: { button: InputAction.IA_PRIMARY, hoverText: "Throw Ball" }
    },
    () => {
      const transform = Transform.getMutable(ball);
      transform.position = Vector3.create(transform.position.x, transform.position.y, transform.position.z + 5);
    }
  );

  // Initialize physics for collision detection
  init(pinEntities, ball);
}
