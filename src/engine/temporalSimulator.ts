import { StructuredSensorContext, CascadedStage } from '../types/journey';

export type SimulationScenarioId = 
  | 'PRIMARY_DEMO'
  | 'TRAFFIC_SLOWDOWN'
  | 'UNEXPECTED_STOP'
  | 'POSSIBLE_INCIDENT'
  | 'INTENTIONAL_PULL_OVER';

export type DemoPhaseId = 
  | 'READY'
  | 'PHASE_1_CRUISING'
  | 'PHASE_2_TRAFFIC'
  | 'PHASE_3_RECOVERY'
  | 'PHASE_4_CRUISING'
  | 'PHASE_5_UNEXPECTED_STOP'
  | 'PHASE_6_CONTEXT_VALIDATION'
  | 'PHASE_7_RIDER_CONFIRMATION'
  | 'PHASE_8_RESUME'
  | 'INCIDENT_STOP'
  | 'PULL_OVER_STOP';

// Math Helpers for Smooth Dynamics
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

export function smoothStep(min: number, max: number, val: number): number {
  const t = clamp((val - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
}

export function interpolate(start: number, end: number, progress: number): number {
  return lerp(start, end, progress);
}

export function calculateEtaMinutes(
  distanceKm: number,
  speedKmH: number,
  isTraffic: boolean = false,
  stopDurationSec: number = 0
): number {
  // Baseline corridor travel time calibrated to corridor standard (~42.7 km/h: 32 km = 45 min)
  const baseMinutes = Math.round((distanceKm / 42.7) * 60);
  let trafficDelay = 0;
  if (isTraffic) {
    trafficDelay = 2 + Math.round((42 - Math.max(15, speedKmH)) / 8);
  }
  let stopDelay = 0;
  if (stopDurationSec > 0) {
    stopDelay = Math.min(4, Math.round(stopDurationSec / 2));
  }
  return Math.max(1, baseMinutes + trafficDelay + stopDelay);
}

export interface SimulationTelemetryState {
  currentSpeed: number;
  previousSpeed: number;
  acceleration: number;
  deceleration: number;
  distanceRemainingKm: number;
  elapsedSeconds: number;
  simulatedTimeStr: string;
  etaMinutes: number;
  routeProgress: number;
  corridorStatus: 'PRIMARY_CORRIDOR' | 'TOLL_APPROACH' | 'SHOULDER' | 'OFF_CORRIDOR';
  nextJourneyContext: string;
  stopDurationSeconds: number;
  tiltAngle: number;
  deviceState: 'MOUNTED_SECURE' | 'VIBRATION_HIGH' | 'TILTED_ANGULAR' | 'FREE_FALL_DROP';
  acousticContext: 'ROAD_NOISE' | 'TRAFFIC_CONGESTION' | 'SCREECH_ABRUPT' | 'SILENCE' | 'ENGINE_IDLE';
  visualContext: 'CLEAR_ROAD' | 'CONGESTION_AHEAD' | 'ROAD_SHOULDER' | 'TILTED_SURFACE' | 'OBSTACLE';
  environmentContext: string;
  currentPhase: DemoPhaseId;
  phaseElapsedSeconds: number;
  recentEvent: {
    title: string;
    description: string;
    timestamp: string;
    severity: 'normal' | 'info' | 'warning' | 'danger';
  };
  cascadedStageOverride?: CascadedStage;
  subStageLabel?: string;
  isPausedForRider: boolean;
}

export class TemporalJourneySimulator {
  private scenario: SimulationScenarioId = 'PRIMARY_DEMO';
  private phase: DemoPhaseId = 'READY';
  private totalElapsedSeconds: number = 0;
  private phaseElapsedSeconds: number = 0;
  private isRunning: boolean = false;
  private isPausedForRider: boolean = false;

  private currentSpeed: number = 0;
  private previousSpeed: number = 0;
  private distanceRemainingKm: number = 32.0;
  private stopDurationSeconds: number = 0;
  private tiltAngle: number = 45;
  private baseStartHour: number = 9;
  private baseStartMinute: number = 41;

  // Primary demo speed curves (second-by-second deterministic profiles)
  private readonly cruising1Speeds = [42, 42, 43, 44, 43, 41, 40, 42, 44, 45, 43, 41, 39, 40, 42];
  private readonly trafficSpeeds = [42, 40, 37, 34, 30, 27, 24, 22, 22, 23, 22, 22];
  private readonly recoverySpeeds = [22, 26, 30, 34, 38, 41, 42, 43];
  private readonly cruising2Speeds = [43, 44, 43, 42, 43, 42, 41, 42];
  private readonly unexpectedStopSpeeds = [42, 39, 34, 28, 21, 12, 4, 0];
  private readonly resumeSpeeds = [0, 8, 15, 24, 31, 38, 41, 42];

  // Secondary Scenario curves
  private readonly incidentSpeeds = [42, 38, 30, 18, 5, 0];
  private readonly incidentTilts = [45, 52, 65, 78, 78, 78];
  private readonly pullOverSpeeds = [42, 38, 30, 20, 10, 0];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.scenario = 'PRIMARY_DEMO';
    this.phase = 'READY';
    this.totalElapsedSeconds = 0;
    this.phaseElapsedSeconds = 0;
    this.isRunning = false;
    this.isPausedForRider = false;
    this.currentSpeed = 0;
    this.previousSpeed = 0;
    this.distanceRemainingKm = 32.0;
    this.stopDurationSeconds = 0;
    this.tiltAngle = 45;
  }

  public startPrimaryDemo(): void {
    this.reset();
    this.scenario = 'PRIMARY_DEMO';
    this.phase = 'PHASE_1_CRUISING';
    this.isRunning = true;
    this.currentSpeed = this.cruising1Speeds[0];
    this.previousSpeed = 42;
  }

  public startTrafficSlowdownScenario(): void {
    this.reset();
    this.scenario = 'TRAFFIC_SLOWDOWN';
    this.phase = 'PHASE_2_TRAFFIC';
    this.isRunning = true;
    this.distanceRemainingKm = 30.8;
    this.totalElapsedSeconds = 15;
    this.currentSpeed = this.trafficSpeeds[0];
    this.previousSpeed = 42;
  }

  public startUnexpectedStopScenario(): void {
    this.reset();
    this.scenario = 'UNEXPECTED_STOP';
    this.phase = 'PHASE_5_UNEXPECTED_STOP';
    this.isRunning = true;
    this.distanceRemainingKm = 30.0;
    this.totalElapsedSeconds = 43;
    this.currentSpeed = this.unexpectedStopSpeeds[0];
    this.previousSpeed = 42;
  }

  public startPossibleIncidentScenario(): void {
    this.reset();
    this.scenario = 'POSSIBLE_INCIDENT';
    this.phase = 'INCIDENT_STOP';
    this.isRunning = true;
    this.distanceRemainingKm = 29.8;
    this.totalElapsedSeconds = 45;
    this.currentSpeed = this.incidentSpeeds[0];
    this.previousSpeed = 42;
    this.tiltAngle = 45;
  }

  public startIntentionalPullOverScenario(): void {
    this.reset();
    this.scenario = 'INTENTIONAL_PULL_OVER';
    this.phase = 'PULL_OVER_STOP';
    this.isRunning = true;
    this.distanceRemainingKm = 29.8;
    this.totalElapsedSeconds = 45;
    this.currentSpeed = this.pullOverSpeeds[0];
    this.previousSpeed = 42;
    this.tiltAngle = 45;
  }

  public confirmRiderOkay(): void {
    if (this.phase === 'PHASE_7_RIDER_CONFIRMATION' || this.phase === 'PHASE_6_CONTEXT_VALIDATION') {
      this.phase = 'PHASE_8_RESUME';
      this.scenario = 'PRIMARY_DEMO';
      this.phaseElapsedSeconds = 0;
      this.isPausedForRider = false;
      this.stopDurationSeconds = 0;
      this.tiltAngle = 45;
    }
  }

  public tick(deltaSeconds: number = 1): SimulationTelemetryState {
    if (!this.isRunning || this.isPausedForRider) {
      return this.generateCurrentTelemetrySnapshot();
    }

    this.totalElapsedSeconds += deltaSeconds;
    this.phaseElapsedSeconds += deltaSeconds;

    // Execute state transitions for scenarios
    switch (this.scenario) {
      case 'PRIMARY_DEMO':
        this.tickPrimaryDemo();
        break;
      case 'TRAFFIC_SLOWDOWN':
        this.tickTrafficScenario();
        break;
      case 'UNEXPECTED_STOP':
        this.tickUnexpectedStopScenario();
        break;
      case 'POSSIBLE_INCIDENT':
        this.tickIncidentScenario();
        break;
      case 'INTENTIONAL_PULL_OVER':
        this.tickPullOverScenario();
        break;
    }

    // Coherent distance progression: decrement according to simulated movement
    if (this.currentSpeed > 0) {
      // 1 real sec represents ~20 simulated secs: 0.0019 * speedKmH km per real sec (32 km -> 30.8 km in 15s)
      const distanceDelta = 0.0019 * this.currentSpeed * deltaSeconds;
      this.distanceRemainingKm = Math.max(0.5, +(this.distanceRemainingKm - distanceDelta).toFixed(2));
    }

    return this.generateCurrentTelemetrySnapshot();
  }

  private tickPrimaryDemo(): void {
    switch (this.phase) {
      case 'PHASE_1_CRUISING': {
        const idx = Math.min(this.phaseElapsedSeconds, this.cruising1Speeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.cruising1Speeds[idx];
        this.tiltAngle = 45;

        // At ~15 seconds, transition to traffic slowdown
        if (this.phaseElapsedSeconds >= this.cruising1Speeds.length) {
          this.phase = 'PHASE_2_TRAFFIC';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }

      case 'PHASE_2_TRAFFIC': {
        const idx = Math.min(this.phaseElapsedSeconds, this.trafficSpeeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.trafficSpeeds[idx];
        this.tiltAngle = 44;

        // At ~12 seconds, transition to recovery
        if (this.phaseElapsedSeconds >= this.trafficSpeeds.length) {
          this.phase = 'PHASE_3_RECOVERY';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }

      case 'PHASE_3_RECOVERY': {
        const idx = Math.min(this.phaseElapsedSeconds, this.recoverySpeeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.recoverySpeeds[idx];
        this.tiltAngle = 45;

        // At ~8 seconds, transition to normal cruising
        if (this.phaseElapsedSeconds >= this.recoverySpeeds.length) {
          this.phase = 'PHASE_4_CRUISING';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }

      case 'PHASE_4_CRUISING': {
        const idx = Math.min(this.phaseElapsedSeconds, this.cruising2Speeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.cruising2Speeds[idx];
        this.tiltAngle = 45;

        // At ~8 seconds, transition to unexpected stop
        if (this.phaseElapsedSeconds >= this.cruising2Speeds.length) {
          this.phase = 'PHASE_5_UNEXPECTED_STOP';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }

      case 'PHASE_5_UNEXPECTED_STOP': {
        const idx = Math.min(this.phaseElapsedSeconds, this.unexpectedStopSpeeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.unexpectedStopSpeeds[idx];
        this.tiltAngle = 52; // upright mount

        if (this.currentSpeed === 0) {
          this.stopDurationSeconds += 1;
        }

        // At ~8 seconds (standstill reached), transition to context validation
        if (this.phaseElapsedSeconds >= this.unexpectedStopSpeeds.length) {
          this.phase = 'PHASE_6_CONTEXT_VALIDATION';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }

      case 'PHASE_6_CONTEXT_VALIDATION': {
        this.previousSpeed = 0;
        this.currentSpeed = 0;
        this.stopDurationSeconds += 1;
        this.tiltAngle = 52;

        // After 4-5 seconds of inconclusive stop validation, escalate to rider confirmation
        if (this.phaseElapsedSeconds >= 4) {
          this.phase = 'PHASE_7_RIDER_CONFIRMATION';
          this.phaseElapsedSeconds = 0;
          this.isPausedForRider = true;
        }
        break;
      }

      case 'PHASE_8_RESUME': {
        const idx = Math.min(this.phaseElapsedSeconds, this.resumeSpeeds.length - 1);
        this.previousSpeed = this.currentSpeed;
        this.currentSpeed = this.resumeSpeeds[idx];
        this.tiltAngle = 45;

        if (this.phaseElapsedSeconds >= this.resumeSpeeds.length) {
          this.phase = 'PHASE_4_CRUISING';
          this.phaseElapsedSeconds = 0;
        }
        break;
      }
    }
  }

  private tickTrafficScenario(): void {
    const idx = Math.min(this.phaseElapsedSeconds, this.trafficSpeeds.length - 1);
    this.previousSpeed = this.currentSpeed;
    this.currentSpeed = this.trafficSpeeds[idx];
    this.tiltAngle = 44;

    if (this.phaseElapsedSeconds >= this.trafficSpeeds.length) {
      // Transition directly to recovery
      this.phase = 'PHASE_3_RECOVERY';
      this.phaseElapsedSeconds = 0;
      this.scenario = 'PRIMARY_DEMO';
    }
  }

  private tickUnexpectedStopScenario(): void {
    if (this.phase === 'PHASE_5_UNEXPECTED_STOP') {
      const idx = Math.min(this.phaseElapsedSeconds, this.unexpectedStopSpeeds.length - 1);
      this.previousSpeed = this.currentSpeed;
      this.currentSpeed = this.unexpectedStopSpeeds[idx];
      this.tiltAngle = 52;

      if (this.currentSpeed === 0) {
        this.stopDurationSeconds += 1;
      }

      if (this.phaseElapsedSeconds >= this.unexpectedStopSpeeds.length) {
        this.phase = 'PHASE_6_CONTEXT_VALIDATION';
        this.phaseElapsedSeconds = 0;
      }
    } else if (this.phase === 'PHASE_6_CONTEXT_VALIDATION') {
      this.previousSpeed = 0;
      this.currentSpeed = 0;
      this.stopDurationSeconds += 1;
      this.tiltAngle = 52;

      if (this.phaseElapsedSeconds >= 4) {
        this.phase = 'PHASE_7_RIDER_CONFIRMATION';
        this.isPausedForRider = true;
      }
    }
  }

  private tickIncidentScenario(): void {
    const idx = Math.min(this.phaseElapsedSeconds, this.incidentSpeeds.length - 1);
    this.previousSpeed = this.currentSpeed;
    this.currentSpeed = this.incidentSpeeds[idx];
    this.tiltAngle = this.incidentTilts[idx];

    if (this.currentSpeed === 0) {
      this.stopDurationSeconds += 1;
      this.isPausedForRider = true; // Stay in incident mode
    }
  }

  private tickPullOverScenario(): void {
    const idx = Math.min(this.phaseElapsedSeconds, this.pullOverSpeeds.length - 1);
    this.previousSpeed = this.currentSpeed;
    this.currentSpeed = this.pullOverSpeeds[idx];
    this.tiltAngle = 58;

    if (this.currentSpeed === 0) {
      this.stopDurationSeconds += 1;
    }
  }

  public getStructuredSensorContext(): StructuredSensorContext {
    const snap = this.generateCurrentTelemetrySnapshot();
    
    return {
      scenarioId: `sim-${snap.currentPhase.toLowerCase()}`,
      scenarioName: snap.recentEvent.title,
      movement: {
        previousSpeed: snap.previousSpeed,
        currentSpeed: snap.currentSpeed,
        deceleration: snap.deceleration,
        stopDuration: snap.stopDurationSeconds,
        tiltAngle: snap.tiltAngle,
      },
      location: {
        corridorStatus: snap.corridorStatus,
        routeDeviationMeters: snap.corridorStatus === 'SHOULDER' ? 2 : 0,
        waypointContext: snap.environmentContext,
        locationName: snap.corridorStatus === 'TOLL_APPROACH' 
          ? 'Medchal Toll Plaza Approach' 
          : snap.corridorStatus === 'SHOULDER'
          ? 'ORR Shoulder Mile 18'
          : 'PVNR Expressway, Hyderabad',
        coordinates: { lat: 17.4125, lng: 78.3984 },
      },
      environment: {
        acousticContext: snap.acousticContext,
        acousticDecibels: snap.acousticContext === 'TRAFFIC_CONGESTION' 
          ? 72 
          : snap.acousticContext === 'SCREECH_ABRUPT' 
          ? 84 
          : 64,
        visualContext: snap.visualContext,
      },
      device: {
        mountedState: snap.deviceState,
      },
      journey: {
        expectedState: snap.currentPhase === 'PHASE_2_TRAFFIC'
          ? 'ORDINARY_CHANGE'
          : snap.currentPhase === 'PHASE_6_CONTEXT_VALIDATION' || snap.currentPhase === 'PHASE_7_RIDER_CONFIRMATION' || snap.currentPhase === 'PULL_OVER_STOP'
          ? 'MEANINGFUL_CHANGE'
          : snap.currentPhase === 'INCIDENT_STOP'
          ? 'POSSIBLE_INCIDENT'
          : 'NORMAL',
        recentHistory: [
          `Cruising speed: ${snap.currentSpeed} km/h`,
          `Corridor: ${snap.corridorStatus}`,
          snap.recentEvent.description,
        ],
      },
    };
  }

  public generateCurrentTelemetrySnapshot(): SimulationTelemetryState {
    const routeProgress = Math.min(95, Math.max(12, Math.round(((32.0 - this.distanceRemainingKm) / 32.0) * 100)));
    const timeStr = this.formatSimulatedTime(this.totalElapsedSeconds);

    let corridorStatus: 'PRIMARY_CORRIDOR' | 'TOLL_APPROACH' | 'SHOULDER' | 'OFF_CORRIDOR' = 'PRIMARY_CORRIDOR';
    let nextJourneyContext = 'Clear corridor · PVNR Expressway';
    let deviceState: 'MOUNTED_SECURE' | 'VIBRATION_HIGH' | 'TILTED_ANGULAR' | 'FREE_FALL_DROP' = 'MOUNTED_SECURE';
    let acousticContext: 'ROAD_NOISE' | 'TRAFFIC_CONGESTION' | 'SCREECH_ABRUPT' | 'SILENCE' | 'ENGINE_IDLE' = 'ROAD_NOISE';
    let visualContext: 'CLEAR_ROAD' | 'CONGESTION_AHEAD' | 'ROAD_SHOULDER' | 'TILTED_SURFACE' | 'OBSTACLE' = 'CLEAR_ROAD';
    let environmentContext = 'PVNR Expressway toward Outer Ring Road';
    let cascadedStageOverride: CascadedStage | undefined;
    let subStageLabel: string | undefined;

    let recentEvent: {
      title: string;
      description: string;
      timestamp: string;
      severity: 'normal' | 'info' | 'warning' | 'danger';
    } = {
      title: 'Normal Cruising',
      description: 'Cruising normally on primary corridor.',
      timestamp: timeStr,
      severity: 'normal',
    };

    let isTraffic = false;

    // Acceleration/deceleration computation (m/s^2)
    // (current - previous) * (1000 / 3600) m/s / 1s
    const accelVal = +((this.currentSpeed - this.previousSpeed) * (1000 / 3600)).toFixed(1);
    const deceleration = accelVal < 0 ? accelVal : 0;
    const acceleration = accelVal > 0 ? accelVal : 0;

    switch (this.phase) {
      case 'READY':
        recentEvent = {
          title: 'Ready for Ride',
          description: 'Awaiting departure from Gachibowli Junction.',
          timestamp: timeStr,
          severity: 'info',
        };
        nextJourneyContext = 'Departure · PVNR Expressway 500 m';
        break;

      case 'PHASE_1_CRUISING':
        recentEvent = {
          title: 'Normal Cruising',
          description: 'Cruising normally at 42 km/h on corridor.',
          timestamp: timeStr,
          severity: 'normal',
        };
        nextJourneyContext = this.phaseElapsedSeconds > 10 ? 'Traffic segment in 800 m' : 'Clear expressway · ORR Link';
        cascadedStageOverride = 'LOW_POWER_BASELINE';
        break;

      case 'PHASE_2_TRAFFIC':
        isTraffic = true;
        corridorStatus = 'TOLL_APPROACH';
        acousticContext = 'TRAFFIC_CONGESTION';
        visualContext = 'CONGESTION_AHEAD';
        environmentContext = 'Medchal Toll Plaza Approach (Urban Flow)';
        nextJourneyContext = 'Traffic slowdown ahead · Medchal approach';
        cascadedStageOverride = 'STATE_DETERMINED';
        recentEvent = {
          title: 'Traffic Slowdown Detected',
          description: 'Traffic-like slowdown detected. Context matches expected corridor. RIDeGUARD stayed quiet.',
          timestamp: timeStr,
          severity: 'info',
        };
        break;

      case 'PHASE_3_RECOVERY':
        nextJourneyContext = 'Clear corridor · ORR Exit 5 in 1.2 km';
        cascadedStageOverride = 'LOW_POWER_BASELINE';
        recentEvent = {
          title: 'Journey Returned to Normal',
          description: 'Journey returned to normal cruising flow.',
          timestamp: timeStr,
          severity: 'normal',
        };
        break;

      case 'PHASE_4_CRUISING':
        nextJourneyContext = 'Exit 5 Link Road in 800 m';
        cascadedStageOverride = 'LOW_POWER_BASELINE';
        recentEvent = {
          title: 'Normal Cruising',
          description: 'Cruising steadily on corridor.',
          timestamp: timeStr,
          severity: 'normal',
        };
        break;

      case 'PHASE_5_UNEXPECTED_STOP':
        deviceState = 'VIBRATION_HIGH';
        acousticContext = 'SCREECH_ABRUPT';
        visualContext = 'ROAD_SHOULDER';
        environmentContext = 'ORR Link Road, Sector 3';
        nextJourneyContext = 'Motion change detected · Validating context...';
        
        if (this.phaseElapsedSeconds < 4) {
          cascadedStageOverride = 'MOTION_GATE';
          subStageLabel = 'Motion change detected.';
          recentEvent = {
            title: 'Motion Change Detected',
            description: 'Sudden deceleration detected on primary corridor.',
            timestamp: timeStr,
            severity: 'warning',
          };
        } else {
          cascadedStageOverride = 'ANOMALY_CANDIDATE';
          subStageLabel = 'Validating context...';
          recentEvent = {
            title: 'Anomaly Candidate',
            description: 'Rapid stop on travel lane. Validating context...',
            timestamp: timeStr,
            severity: 'warning',
          };
        }
        break;

      case 'PHASE_6_CONTEXT_VALIDATION':
        acousticContext = 'SILENCE';
        visualContext = 'ROAD_SHOULDER';
        environmentContext = 'ORR Link Road, Standstill';
        nextJourneyContext = 'Context Inconclusive · Rider confirmation required';
        cascadedStageOverride = 'CONTEXT_VALIDATION';
        subStageLabel = 'Validating context...';
        recentEvent = {
          title: 'Sudden Stop Detected',
          description: 'Sudden stop detected. Cause remains unresolved. Rider confirmation required.',
          timestamp: timeStr,
          severity: 'warning',
        };
        break;

      case 'PHASE_7_RIDER_CONFIRMATION':
        nextJourneyContext = 'Awaiting Rider Check: "ARE YOU OKAY?"';
        cascadedStageOverride = 'STATE_DETERMINED';
        recentEvent = {
          title: 'Rider Confirmation Prompt',
          description: 'Meaningful change: Awaiting rider verification.',
          timestamp: timeStr,
          severity: 'warning',
        };
        break;

      case 'PHASE_8_RESUME':
        nextJourneyContext = 'Resuming corridor route toward HITAM';
        cascadedStageOverride = 'LOW_POWER_BASELINE';
        recentEvent = {
          title: 'Journey Resumed',
          description: 'Rider confirmed safe. Journey returned to normal.',
          timestamp: timeStr,
          severity: 'normal',
        };
        break;

      case 'INCIDENT_STOP':
        deviceState = 'TILTED_ANGULAR';
        acousticContext = 'SCREECH_ABRUPT';
        visualContext = 'TILTED_SURFACE';
        environmentContext = 'Outer Ring Road Link, Sector 4';
        nextJourneyContext = 'Possible incident · Assistance payload ready';
        cascadedStageOverride = 'STATE_DETERMINED';
        recentEvent = {
          title: 'Possible Incident Detected',
          description: 'Severe motion change detected. Context unresolved. Assistance available.',
          timestamp: timeStr,
          severity: 'danger',
        };
        break;

      case 'PULL_OVER_STOP':
        corridorStatus = 'SHOULDER';
        acousticContext = 'ENGINE_IDLE';
        visualContext = 'ROAD_SHOULDER';
        environmentContext = 'Highway Shoulder Lay-by, ORR Mile 18';
        nextJourneyContext = 'Shoulder lay-by · Planned stop';
        cascadedStageOverride = 'CONTEXT_VALIDATION';
        recentEvent = {
          title: 'Roadside Pull-Over Detected',
          description: 'Shoulder waypoint and dismount posture. Checking with rider.',
          timestamp: timeStr,
          severity: 'warning',
        };
        break;
    }

    const etaMinutes = calculateEtaMinutes(
      this.distanceRemainingKm,
      this.currentSpeed,
      isTraffic,
      this.stopDurationSeconds
    );

    return {
      currentSpeed: Math.round(this.currentSpeed),
      previousSpeed: Math.round(this.previousSpeed),
      acceleration,
      deceleration,
      distanceRemainingKm: this.distanceRemainingKm,
      elapsedSeconds: this.totalElapsedSeconds,
      simulatedTimeStr: timeStr,
      etaMinutes,
      routeProgress,
      corridorStatus,
      nextJourneyContext,
      stopDurationSeconds: this.stopDurationSeconds,
      tiltAngle: this.tiltAngle,
      deviceState,
      acousticContext,
      visualContext,
      environmentContext,
      currentPhase: this.phase,
      phaseElapsedSeconds: this.phaseElapsedSeconds,
      recentEvent,
      cascadedStageOverride,
      subStageLabel,
      isPausedForRider: this.isPausedForRider,
    };
  }

  private formatSimulatedTime(secondsOffset: number): string {
    const totalMinutes = this.baseStartMinute + Math.floor(secondsOffset / 60);
    const minute = totalMinutes % 60;
    const hour = this.baseStartHour + Math.floor(totalMinutes / 60);
    const second = secondsOffset % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
  }
}
