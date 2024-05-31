import { engine, Transform, Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Define a collision threshold (adjust as needed)
const COLLISION_THRESHOLD = 1.0;

export function init(pinEntities: Entity[], ball: Entity) {
  // Add collision detection system
  engine.addSystem(function updateCollisionDetection(dt: number) {
    // Get ball transform
    const ballTransform = Transform.getOrNull(ball);
    if (!ballTransform) return;
    const ballPosition = ballTransform.position;

    // Check for collisions with each pin
    for (const pin of pinEntities) {
      const pinTransform = Transform.getOrNull(pin);
      if (!pinTransform) continue;
      const pinPosition = pinTransform.position;

      // Calculate distance between ball and pin
      const distance = Vector3.distance(ballPosition, pinPosition);

      // Check for collision
      if (distance < COLLISION_THRESHOLD) {
        // Remove pin from scene
        engine.removeEntity(pin);
      }
    }
  });
}
