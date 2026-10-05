import { JourneyState, SensorData, StructuredSensorContext } from '../types/journey';
import { createCruisingContext } from './journeyEvaluator';

export class SensorSimulator {
  private lastContext: StructuredSensorContext = createCruisingContext();

  public getSensorSnapshotFromContext(context: StructuredSensorContext, _state: JourneyState): SensorData {
    this.lastContext = context;
    const jitter = (range: number) => (Math.random() - 0.5) * range;

    const currentSpeed = Math.max(0, context.movement.currentSpeed + jitter(0.5));
    const accelX = Number((context.movement.deceleration + jitter(0.1)).toFixed(2));
    const accelY = Number((0.05 + jitter(0.05)).toFixed(2));
    const accelZ = Number((9.81 + jitter(0.2)).toFixed(2));
    const gyroTilt = Number((context.movement.tiltAngle + jitter(1)).toFixed(0));

    return {
      speed: currentSpeed,
      accelX,
      accelY,
      accelZ,
      gyroTilt,
      gnssFix: 'Locked (21 Satellites - Simulated Context)',
      gnssAccuracy: '±0.9m (Simulated)',
      audioClass: context.environment.acousticContext,
      audioDecibels: context.environment.acousticDecibels + Math.floor(jitter(2)),
      cameraClass: context.environment.visualContext,
      deviceState: context.device.mountedState,
      evaluationLatencyMs: 1, // deterministic local CPU evaluation (<1ms)
    };
  }

  // Backward compatibility wrapper for ticks
  public getSensorSnapshot(state: JourneyState, currentSpeed: number): SensorData {
    const updatedCtx: StructuredSensorContext = {
      ...this.lastContext,
      movement: {
        ...this.lastContext.movement,
        currentSpeed,
      },
    };
    return this.getSensorSnapshotFromContext(updatedCtx, state);
  }
}
