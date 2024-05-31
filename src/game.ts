import { engine, Transform, Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

// Define a collision threshold (adjust as needed)
const COLLISION_THRESHOLD = 1.0;
const BALL_SPEED = 1.0; // Adjust the speed of the ball

let isBallMoving = false;
let ballDirection: Vector3;
let ballTargetPosition: Vector3;

export function init(pinEntities: Entity[], ball: Entity) {
  // Add collision detection system
  engine.addSystem(updateCollisionDetection);
  engine.addSystem(moveBallSystem);

  // Collision detection system function
  function updateCollisionDetection(dt: number) {
    if (!isBallMoving) return;

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
  }

  // Ball movement system function
  function moveBallSystem(dt: number) {
    if (!isBallMoving) return;

    const ballTransform = Transform.getMutable(ball);
    const newPosition = Vector3.add(ballTransform.position, Vector3.scale(ballDirection, BALL_SPEED * dt));

    if (Vector3.distance(newPosition, ballTargetPosition) <= BALL_SPEED * dt) {
      ballTransform.position = ballTargetPosition;
      isBallMoving = false;
    } else {
      ballTransform.position = newPosition;
    }
  }
}

export function throwBall(ball: Entity, direction: Vector3, distance: number) {
  const ballTransform = Transform.getOrNull(ball);
  if (!ballTransform) return;

  ballDirection = Vector3.normalize(direction);
  ballTargetPosition = Vector3.add(ballTransform.position, Vector3.scale(ballDirection, distance));
  isBallMoving = true;
}
