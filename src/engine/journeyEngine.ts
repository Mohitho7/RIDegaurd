import { JourneyContext, JourneyState, TimelineEvent, StructuredSensorContext, EvaluatorResult, TripItem } from '../types/journey';
import { 
  evaluateJourneyContext, 
  createCruisingContext 
} from './journeyEvaluator';
import { 
  TemporalJourneySimulator, 
  SimulationTelemetryState 
} from './temporalSimulator';

const TRIPS_STORAGE_KEY = 'rideguard_trips_history';

export class JourneyStateEngine {
  private currentState: JourneyState = 'READY';
  private simulator: TemporalJourneySimulator = new TemporalJourneySimulator();
  private currentContextInput: StructuredSensorContext = createCruisingContext();
  private lastEvaluatorResult?: EvaluatorResult;
  private hasActiveRide: boolean = false;
  private lastRecordedMilestone: string = '';

  private context: JourneyContext = {
    currentSpeed: 0,
    targetSpeed: 0,
    movementState: 'stationary',
    locationName: 'Gachibowli Junction, Hyderabad',
    coordinates: { lat: 17.4401, lng: 78.3489 },
    destinationName: 'HITAM Campus, Hyderabad',
    routeProgress: 0,
    routeDeviationMeters: 0,
    distanceRemainingKm: 32.0,
    elapsedSeconds: 0,
    etaMinutes: 45,
    corridorStatus: 'PRIMARY_CORRIDOR',
    nextJourneyContext: 'Departure · PVNR Expressway in 500 m',
    stopDurationSeconds: 0,
    recentJourneyEvent: {
      title: 'Local Context Engine Initialized',
      description: 'Deterministic journey-state reasoning runtime active. Ready for ride tracking.',
      timestamp: '09:41:00',
      severity: 'info',
    },
    observedAnomalyReason: '',
    fusedConfidence: 98,
    interpretations: {
      traffic: 5,
      temporaryStop: 5,
      intentionalStop: 88,
      possibleIncident: 2,
    },
    riderResponse: 'NONE',
    sosDispatched: false,
    sensorGating: {
      mic: 'STANDBY (GATED)',
      camera: 'STANDBY (EPISODIC)',
      motion: 'LOW-POWER BASELINE',
      stage: 'BASELINE MONITORING',
    },
  };

  private timeline: TimelineEvent[] = [
    {
      id: 'evt-init',
      timeString: '09:41:00',
      state: 'READY',
      title: 'Local Context Engine Initialized',
      description: 'Deterministic journey-state reasoning runtime active on primary corridor.',
      severity: 'info',
      telemetrySnapshot: { speed: 0, accel: 0, sensor: 'Gated Baseline' },
    }
  ];

  private completedTrips: TripItem[] = [];

  constructor() {
    this.loadCompletedTrips();
  }

  public getState(): JourneyState {
    return this.currentState;
  }

  public getContext(): JourneyContext {
    return { ...this.context };
  }

  public getTimeline(): TimelineEvent[] {
    return [...this.timeline];
  }

  public getCompletedTrips(): TripItem[] {
    return [...this.completedTrips];
  }

  public getStructuredInput(): StructuredSensorContext {
    return { ...this.currentContextInput };
  }

  public getSimulator(): TemporalJourneySimulator {
    return this.simulator;
  }

  /**
   * CORE CAUSAL ENTRY POINT:
   * Evaluates structured context deterministically and updates state & hypotheses.
   */
  public applySensorContext(input: StructuredSensorContext): EvaluatorResult {
    this.currentContextInput = input;
    const result = evaluateJourneyContext(input);
    this.lastEvaluatorResult = result;

    this.currentState = result.state;
    this.context.currentSpeed = input.movement.currentSpeed;
    this.context.targetSpeed = input.movement.previousSpeed;
    this.context.locationName = input.location.locationName;
    this.context.coordinates = input.location.coordinates;
    this.context.observedAnomalyReason = result.anomalyReason;
    this.context.structuredInput = input;
    this.context.evaluatorResult = result;
    this.context.cascadedStage = result.stage;
    this.context.corridorStatus = input.location.corridorStatus;
    this.context.stopDurationSeconds = input.movement.stopDuration;

    // Movement state derivation
    if (input.movement.currentSpeed === 0 && input.movement.tiltAngle >= 70) {
      this.context.movementState = 'unusual_impact';
    } else if (input.movement.currentSpeed === 0) {
      this.context.movementState = 'stationary';
    } else if (input.movement.deceleration < -1.5) {
      this.context.movementState = 'smooth_decel';
    } else {
      this.context.movementState = 'stable_cruising';
    }

    // Dynamic Sensor Gating & Cascaded Sensing status for UI indicators
    this.context.sensorGating = {
      mic: result.gatingStatus.micGated === 'EVENT_TRIGGERED_ACTIVE' ? 'ACTIVE (EVALUATED)' : 'STANDBY (GATED)',
      camera: result.gatingStatus.cameraGated === 'EVENT_TRIGGERED_CAPTURED' ? 'ACTIVE (EVALUATED)' : 'STANDBY (EPISODIC)',
      motion: result.gatingStatus.motionGatePassed ? 'ANOMALY DETECTED' : 'LOW-POWER BASELINE',
      stage: result.stage === 'LOW_POWER_BASELINE' 
        ? 'BASELINE MONITORING' 
        : result.stage === 'MOTION_GATE' 
        ? 'MOTION GATE' 
        : result.stage === 'ANOMALY_CANDIDATE' 
        ? 'ANOMALY CANDIDATE' 
        : result.stage === 'CONTEXT_VALIDATION' 
        ? 'CONTEXT VALIDATION' 
        : 'JOURNEY STATE',
    };

    // Calculate interpretation weights directly from evaluated plausibilities
    this.updateInterpretationScores(result);

    return result;
  }

  // Continuous deterministic temporal simulation step
  public updateTelemetryTick(deltaSeconds: number): void {
    if (!this.hasActiveRide) return;

    const telemetry: SimulationTelemetryState = this.simulator.tick(deltaSeconds);
    const sensorContext = this.simulator.getStructuredSensorContext();
    this.currentContextInput = sensorContext;

    // Run causal evaluator on live simulated context
    const result = evaluateJourneyContext(sensorContext);
    this.lastEvaluatorResult = result;

    // Synchronize journey context
    this.context.currentSpeed = telemetry.currentSpeed;
    this.context.targetSpeed = telemetry.previousSpeed;
    this.context.distanceRemainingKm = telemetry.distanceRemainingKm;
    this.context.routeProgress = telemetry.routeProgress;
    this.context.elapsedSeconds = telemetry.elapsedSeconds;
    this.context.etaMinutes = telemetry.etaMinutes;
    this.context.corridorStatus = telemetry.corridorStatus;
    this.context.nextJourneyContext = telemetry.nextJourneyContext;
    this.context.stopDurationSeconds = telemetry.stopDurationSeconds;
    this.context.simulationPhase = telemetry.currentPhase;
    this.context.recentJourneyEvent = telemetry.recentEvent;
    this.context.locationName = sensorContext.location.locationName;
    this.context.coordinates = sensorContext.location.coordinates;
    this.context.observedAnomalyReason = result.anomalyReason;
    this.context.structuredInput = sensorContext;
    this.context.evaluatorResult = result;

    // Movement state derivation
    if (telemetry.currentSpeed === 0 && telemetry.tiltAngle >= 70) {
      this.context.movementState = 'unusual_impact';
    } else if (telemetry.currentSpeed === 0) {
      this.context.movementState = 'stationary';
    } else if (telemetry.deceleration < -1.5) {
      this.context.movementState = 'smooth_decel';
    } else {
      this.context.movementState = 'stable_cruising';
    }

    // Determine Journey State based on Evaluator & Temporal Phase transitions
    let activeStage: typeof result.stage = result.stage;
    if (telemetry.cascadedStageOverride) {
      activeStage = telemetry.cascadedStageOverride;
    }
    this.context.cascadedStage = activeStage;

    if (telemetry.currentPhase === 'PHASE_5_UNEXPECTED_STOP') {
      // Smooth deceleration: First MOTION GATE -> ANOMALY CANDIDATE, not yet Meaningful Change!
      this.currentState = 'NORMAL';
      activeStage = telemetry.phaseElapsedSeconds < 4 ? 'MOTION_GATE' : 'ANOMALY_CANDIDATE';
      this.context.cascadedStage = activeStage;
    } else if (telemetry.currentPhase === 'PHASE_6_CONTEXT_VALIDATION') {
      this.currentState = 'MEANINGFUL_CHANGE';
      activeStage = 'CONTEXT_VALIDATION';
      this.context.cascadedStage = activeStage;
    } else if (telemetry.currentPhase === 'PHASE_7_RIDER_CONFIRMATION') {
      this.currentState = 'RIDER_CONFIRMATION';
      activeStage = 'STATE_DETERMINED';
      this.context.cascadedStage = activeStage;
    } else if (telemetry.currentPhase === 'PHASE_8_RESUME') {
      this.currentState = 'NORMAL_RECOVERED';
      activeStage = 'LOW_POWER_BASELINE';
      this.context.cascadedStage = activeStage;
    } else if (telemetry.currentPhase === 'INCIDENT_STOP') {
      this.currentState = 'POSSIBLE_INCIDENT';
    } else {
      this.currentState = result.state;
    }

    // Dynamic Sensor Gating
    this.context.sensorGating = {
      mic: result.gatingStatus.micGated === 'EVENT_TRIGGERED_ACTIVE' ? 'ACTIVE (EVALUATED)' : 'STANDBY (GATED)',
      camera: result.gatingStatus.cameraGated === 'EVENT_TRIGGERED_CAPTURED' ? 'ACTIVE (EVALUATED)' : 'STANDBY (EPISODIC)',
      motion: result.gatingStatus.motionGatePassed ? 'ANOMALY DETECTED' : 'LOW-POWER BASELINE',
      stage: activeStage === 'LOW_POWER_BASELINE' 
        ? 'BASELINE MONITORING' 
        : activeStage === 'MOTION_GATE' 
        ? 'MOTION GATE' 
        : activeStage === 'ANOMALY_CANDIDATE' 
        ? 'ANOMALY CANDIDATE' 
        : activeStage === 'CONTEXT_VALIDATION' 
        ? 'CONTEXT VALIDATION' 
        : 'JOURNEY STATE',
    };

    this.updateInterpretationScores(result);

    // Record discrete milestone events to timeline
    this.recordMilestones(telemetry, result);
  }

  private recordMilestones(telemetry: SimulationTelemetryState, _result: EvaluatorResult): void {
    const timeStr = telemetry.simulatedTimeStr;

    if (telemetry.currentPhase === 'PHASE_1_CRUISING' && this.lastRecordedMilestone !== 'cruising_1') {
      this.lastRecordedMilestone = 'cruising_1';
      this.addTimelineEvent(
        'NORMAL',
        'Normal Cruising',
        'Cruising steadily on primary corridor at 42 km/h. Low-power baseline monitoring.',
        'normal',
        timeStr,
        { speed: telemetry.currentSpeed, accel: telemetry.deceleration, sensor: 'Corridor GPS Fix' }
      );
    } else if (telemetry.currentPhase === 'PHASE_2_TRAFFIC' && this.lastRecordedMilestone !== 'traffic') {
      this.lastRecordedMilestone = 'traffic';
      this.addTimelineEvent(
        'ORDINARY_CHANGE',
        'Traffic Slowdown Detected',
        'Gradual traffic compression on corridor. Context matches expected flow. RIDeGUARD stayed quiet.',
        'info',
        timeStr,
        { speed: telemetry.currentSpeed, accel: telemetry.deceleration, sensor: 'Acoustic Traffic Signature' }
      );
    } else if (telemetry.currentPhase === 'PHASE_3_RECOVERY' && this.lastRecordedMilestone !== 'recovery') {
      this.lastRecordedMilestone = 'recovery';
      this.addTimelineEvent(
        'NORMAL',
        'Journey Flow Recovered',
        'Corridor flow returned to normal speed (41 km/h). Baselined without rider prompt.',
        'normal',
        timeStr,
        { speed: telemetry.currentSpeed, accel: telemetry.deceleration, sensor: 'Corridor Cruising' }
      );
    } else if (telemetry.currentPhase === 'PHASE_5_UNEXPECTED_STOP') {
      if (telemetry.phaseElapsedSeconds < 4 && this.lastRecordedMilestone !== 'motion_gate_stop') {
        this.lastRecordedMilestone = 'motion_gate_stop';
        this.addTimelineEvent(
          'NORMAL',
          'Unexpected Deceleration Detected',
          'Rapid deceleration (42 → 0 km/h) flagged by motion gate. Context validation initiated.',
          'warning',
          timeStr,
          { speed: telemetry.currentSpeed, accel: telemetry.deceleration, sensor: 'IMU Motion Gate' }
        );
      } else if (telemetry.phaseElapsedSeconds >= 4 && this.lastRecordedMilestone !== 'anomaly_candidate') {
        this.lastRecordedMilestone = 'anomaly_candidate';
        this.addTimelineEvent(
          'NORMAL',
          'Anomaly Candidate Flagged',
          'Rapid stop on active travel lane. Validating episodic audio & vision context.',
          'warning',
          timeStr,
          { speed: telemetry.currentSpeed, accel: telemetry.deceleration, sensor: 'Event Gating Active' }
        );
      }
    } else if (telemetry.currentPhase === 'PHASE_6_CONTEXT_VALIDATION' && this.lastRecordedMilestone !== 'context_validation') {
      this.lastRecordedMilestone = 'context_validation';
      this.addTimelineEvent(
        'MEANINGFUL_CHANGE',
        'Meaningful Change: Cause Unresolved',
        'Vehicle stationary on primary corridor. Context validation inconclusive. Prompting rider confirmation.',
        'warning',
        timeStr,
        { speed: 0, accel: 0, sensor: 'Context Inconclusive (Tilt 52°)' }
      );
    } else if (telemetry.currentPhase === 'PHASE_7_RIDER_CONFIRMATION' && this.lastRecordedMilestone !== 'rider_confirmation_prompt') {
      this.lastRecordedMilestone = 'rider_confirmation_prompt';
      this.addTimelineEvent(
        'RIDER_CONFIRMATION',
        'Rider Confirmation Prompted',
        'Meaningful change observed. Awaiting 1-tap rider check: "Are you okay?"',
        'warning',
        timeStr,
        { speed: 0, accel: 0, sensor: 'Awaiting User Confirmation' }
      );
    } else if (telemetry.currentPhase === 'PHASE_8_RESUME' && this.lastRecordedMilestone !== 'resume') {
      this.lastRecordedMilestone = 'resume';
      this.addTimelineEvent(
        'NORMAL',
        'Journey Resumed',
        'Rider confirmed safe. Vehicle accelerating back to corridor speed (41 km/h). False alarm avoided.',
        'normal',
        timeStr,
        { speed: telemetry.currentSpeed, accel: telemetry.acceleration, sensor: 'Motion Resumed' }
      );
    } else if (telemetry.currentPhase === 'INCIDENT_STOP' && this.lastRecordedMilestone !== 'incident_stop') {
      this.lastRecordedMilestone = 'incident_stop';
      this.addTimelineEvent(
        'POSSIBLE_INCIDENT',
        'Possible Incident Detected',
        'Severe deceleration with abnormal angular tilt (78°). Emergency assistance mode ready.',
        'danger',
        timeStr,
        { speed: 0, accel: telemetry.deceleration, sensor: 'Tilt 78° (Tilted Surface)' }
      );
    } else if (telemetry.currentPhase === 'PULL_OVER_STOP' && this.lastRecordedMilestone !== 'pull_over') {
      this.lastRecordedMilestone = 'pull_over';
      this.addTimelineEvent(
        'MEANINGFUL_CHANGE',
        'Roadside Pull-Over Detected',
        'Vehicle moved safely to shoulder lay-by (58° tilt, engine idle). Checking with rider.',
        'warning',
        timeStr,
        { speed: 0, accel: telemetry.deceleration, sensor: 'Shoulder Lay-by GPS' }
      );
    }
  }

  private updateInterpretationScores(result: EvaluatorResult): void {
    let trafficScore = 10;
    let tempStopScore = 10;
    let intentionalScore = 10;
    let incidentScore = 5;

    result.consideredCauses.forEach((c) => {
      const weight = c.plausibility === 'high' ? 70 : c.plausibility === 'moderate' ? 25 : c.plausibility === 'unlikely' ? 5 : 0;
      if (c.cause === 'Traffic') trafficScore = weight;
      else if (c.cause === 'Obstruction') tempStopScore = weight;
      else if (c.cause === 'Intentional pull-over') intentionalScore = weight;
      else if (c.cause === 'Possible incident') incidentScore = weight;
    });

    const sum = Math.max(1, trafficScore + tempStopScore + intentionalScore + incidentScore);
    this.context.interpretations = {
      traffic: Math.round((trafficScore / sum) * 100),
      temporaryStop: Math.round((tempStopScore / sum) * 100),
      intentionalStop: Math.round((intentionalScore / sum) * 100),
      possibleIncident: Math.round((incidentScore / sum) * 100),
    };
  }

  // Live Demo Handlers
  public startRide(): void {
    this.hasActiveRide = true;
    this.simulator.startPrimaryDemo();
    this.lastRecordedMilestone = 'started';
    
    this.context.riderResponse = 'NONE';
    this.context.sosDispatched = false;
    this.context.distanceRemainingKm = 32.0;
    this.context.etaMinutes = 45;

    this.addTimelineEvent(
      'NORMAL',
      'Journey Started',
      'Departure from Gachibowli toward HITAM Campus. Monitoring initialized.',
      'normal',
      '09:41:00',
      { speed: 42, accel: 0.0, sensor: 'Baseline GPS + IMU' }
    );

    this.updateTelemetryTick(0);
  }

  public triggerOrdinaryChange(): void {
    this.hasActiveRide = true;
    this.simulator.startTrafficSlowdownScenario();
    this.updateTelemetryTick(0);
  }

  public triggerMeaningfulChange(): void {
    this.hasActiveRide = true;
    this.simulator.startUnexpectedStopScenario();
    this.updateTelemetryTick(0);
  }

  public triggerDirectIncident(): void {
    this.hasActiveRide = true;
    this.simulator.startPossibleIncidentScenario();
    this.updateTelemetryTick(0);
  }

  public triggerIntentionalPullOver(): void {
    this.hasActiveRide = true;
    this.simulator.startIntentionalPullOverScenario();
    this.updateTelemetryTick(0);
  }

  public enterContextAnalysis(): void {
    this.currentState = 'CONTEXT_ANALYSIS';
    if (this.context.sensorGating) {
      this.context.sensorGating.stage = 'CONTEXT VALIDATION';
    }
  }

  public enterRiderConfirmation(): void {
    this.currentState = 'RIDER_CONFIRMATION';
  }

  public respondImOkay(): void {
    this.currentState = 'NORMAL_RECOVERED';
    this.context.riderResponse = 'IM_OKAY';
    this.context.observedAnomalyReason = 'Rider verified safe. Roadside stop self-resolved. False alarm avoided.';
    this.simulator.confirmRiderOkay();

    if (this.context.sensorGating) {
      this.context.sensorGating.mic = 'STANDBY (GATED)';
      this.context.sensorGating.camera = 'STANDBY (EPISODIC)';
      this.context.sensorGating.motion = 'LOW-POWER BASELINE';
      this.context.sensorGating.stage = 'BASELINE MONITORING';
    }

    const timeStr = this.timeline[0]?.timeString || '09:42:10';
    this.addTimelineEvent(
      'NORMAL_RECOVERED',
      'Rider Confirmed: I’m Okay',
      'Self-resolved anomaly. False alarm avoided. Journey state baselined back to Normal.',
      'normal',
      timeStr,
      { speed: 0, accel: 0, sensor: 'User 1-Tap Acknowledgment' }
    );
  }

  public continueActiveJourney(): void {
    if (this.hasActiveRide) {
      this.currentState = 'NORMAL';
      this.updateTelemetryTick(0);
    }
  }

  public respondNeedHelp(): void {
    this.currentState = 'ASSIST';
    this.context.riderResponse = 'NEED_HELP';
    this.context.sosDispatched = true;

    const timeStr = this.timeline[0]?.timeString || '09:42:12';
    this.addTimelineEvent(
      'ASSIST',
      'Assistance Requested — Assistance Mode Active',
      'Assistance payload generated with precise location coordinates and context snapshot.',
      'danger',
      timeStr,
      { speed: 0, accel: 0, sensor: 'Assistance Subsystem Ready' }
    );
  }

  public endRide(): void {
    if (this.hasActiveRide && this.timeline.length > 1) {
      this.archiveCurrentRideToTrips();
    }
    this.resetJourney();
  }

  public resetJourney(): void {
    if (this.hasActiveRide && this.timeline.length > 2) {
      this.archiveCurrentRideToTrips();
    }
    this.hasActiveRide = false;
    this.simulator.reset();
    this.lastRecordedMilestone = '';
    this.currentState = 'READY';
    this.currentContextInput = createCruisingContext();
    this.context = {
      currentSpeed: 0,
      targetSpeed: 0,
      movementState: 'stationary',
      locationName: 'Gachibowli Junction, Hyderabad',
      coordinates: { lat: 17.4401, lng: 78.3489 },
      destinationName: 'HITAM Campus, Hyderabad',
      routeProgress: 0,
      routeDeviationMeters: 0,
      distanceRemainingKm: 32.0,
      elapsedSeconds: 0,
      etaMinutes: 45,
      corridorStatus: 'PRIMARY_CORRIDOR',
      nextJourneyContext: 'Departure · PVNR Expressway in 500 m',
      stopDurationSeconds: 0,
      recentJourneyEvent: {
        title: 'Local Context Engine Initialized',
        description: 'Deterministic journey-state reasoning runtime active on primary corridor.',
        timestamp: '09:41:00',
        severity: 'info',
      },
      observedAnomalyReason: '',
      fusedConfidence: 98,
      interpretations: {
        traffic: 5,
        temporaryStop: 5,
        intentionalStop: 88,
        possibleIncident: 2,
      },
      riderResponse: 'NONE',
      sosDispatched: false,
      sensorGating: {
        mic: 'STANDBY (GATED)',
        camera: 'STANDBY (EPISODIC)',
        motion: 'LOW-POWER BASELINE',
        stage: 'BASELINE MONITORING',
      },
    };

    this.timeline = [];
  }

  private addTimelineEvent(
    state: JourneyState,
    title: string,
    description: string,
    severity: 'normal' | 'info' | 'warning' | 'danger',
    timeString: string,
    telemetrySnapshot?: { speed: number; accel: number; sensor: string }
  ) {
    const event: TimelineEvent = {
      id: 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      timeString,
      state,
      title,
      description,
      severity,
      telemetrySnapshot,
    };
    this.timeline.unshift(event);
  }

  // Session archive bridging live rides to Trips
  private archiveCurrentRideToTrips(): void {
    const meaningfulEvents = this.timeline.filter((e) => e.state === 'MEANINGFUL_CHANGE' || e.state === 'POSSIBLE_INCIDENT' || e.state === 'ASSIST');
    const hasAssistance = this.timeline.some((e) => e.state === 'ASSIST');
    const hasMeaningful = meaningfulEvents.length > 0;

    const statusText = hasAssistance 
      ? 'Assistance requested' 
      : hasMeaningful 
      ? `${meaningfulEvents.length} meaningful change` 
      : 'Normal';

    const statusType: 'normal' | 'warning' | 'danger' = hasAssistance ? 'danger' : hasMeaningful ? 'warning' : 'normal';

    const traveledKm = Math.max(0.4, 32.0 - this.context.distanceRemainingKm).toFixed(1);

    const newTrip: TripItem = {
      id: 'trip-live-' + Date.now(),
      dateLabel: 'Today (Live Session)',
      origin: 'Hyderabad',
      destination: 'HITAM',
      distance: `${traveledKm} km`,
      duration: `${Math.round(this.context.elapsedSeconds / 60) || 1} min`,
      statusText,
      statusType,
      sequence: hasAssistance ? 'NORMAL ── CHANGE ── ASSIST' : hasMeaningful ? 'NORMAL ── CHANGE ── RESOLVED' : 'NORMAL ── SMOOTH',
      events: this.timeline.slice().reverse().map((e) => ({
        time: e.timeString.slice(0, 5),
        label: e.title,
        detail: e.description,
      })),
    };

    // Prepend and save
    this.completedTrips = [newTrip, ...this.completedTrips.filter((t) => !t.id.startsWith('trip-live-'))];
    this.saveCompletedTrips();
  }

  private loadCompletedTrips(): void {
    const seedTrips: TripItem[] = [
      {
        id: 'trip-seed-1',
        dateLabel: 'Yesterday',
        origin: 'HITAM',
        destination: 'Hyderabad',
        distance: '34 km',
        duration: '52 min',
        statusText: '1 meaningful change',
        statusType: 'warning',
        sequence: 'NORMAL ── CHANGE ── NORMAL',
        events: [
          { time: '18:15', label: 'Started', detail: 'Return commute' },
          { time: '18:32', label: 'Traffic slowdown', detail: 'Ordinary flow adaptation near Medchal' },
          { time: '18:48', label: 'Roadside stop', detail: 'Confirmed safe via 1-tap' },
          { time: '19:07', label: 'Arrived safely', detail: 'Trip complete' },
        ],
      },
      {
        id: 'trip-seed-2',
        dateLabel: 'Sep 30',
        origin: 'City Center',
        destination: 'Gachibowli IT Corridor',
        distance: '18 km',
        duration: '31 min',
        statusText: 'Normal',
        statusType: 'normal',
        sequence: 'NORMAL',
        events: [
          { time: '11:20', label: 'Started', detail: 'Urban route' },
          { time: '11:51', label: 'Arrived safely', detail: 'Smooth trip' },
        ],
      },
    ];

    try {
      const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
      if (stored) {
        this.completedTrips = JSON.parse(stored);
      } else {
        this.completedTrips = seedTrips;
      }
    } catch {
      this.completedTrips = seedTrips;
    }
  }

  private saveCompletedTrips(): void {
    try {
      localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(this.completedTrips));
    } catch {
      // safe fallback if storage is restricted
    }
  }
}
