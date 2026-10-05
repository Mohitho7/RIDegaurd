export type JourneyState = 
  | 'READY'
  | 'NORMAL'
  | 'ORDINARY_CHANGE'
  | 'MEANINGFUL_CHANGE'
  | 'CONTEXT_ANALYSIS'
  | 'RIDER_CONFIRMATION'
  | 'NORMAL_RECOVERED'
  | 'POSSIBLE_INCIDENT'
  | 'ASSIST';

export type MainTab = 'RIDE' | 'TRIPS' | 'GROUP' | 'YOU';

export type TechModal = 
  | 'NONE'
  | 'DEMO_CONSOLE'
  | 'WHY_EXPLANATION'
  | 'TECH_INSPECTOR'
  | 'SCENARIO_LAB'
  | 'OFFICE_KIT'
  | 'PIPELINE'
  | 'HARDWARE'
  | 'EDGE_ARCH'
  | 'SETTINGS'
  | 'PRIVACY'
  | 'RIDE_PREFERENCES'
  | 'EMERGENCY_CONTACTS';

export type SubView = TechModal;

export type CascadedStage = 
  | 'LOW_POWER_BASELINE' 
  | 'MOTION_GATE' 
  | 'ANOMALY_CANDIDATE' 
  | 'CONTEXT_VALIDATION' 
  | 'STATE_DETERMINED';

export interface StructuredSensorContext {
  scenarioId?: string;
  scenarioName?: string;
  movement: {
    previousSpeed: number;
    currentSpeed: number;
    deceleration: number; // m/s^2, e.g. -6.8 or -1.8
    stopDuration: number; // seconds stationary
    tiltAngle: number; // degrees (e.g. 45=normal upright, 58=shoulder dismount, 78=down)
  };
  location: {
    corridorStatus: 'PRIMARY_CORRIDOR' | 'TOLL_APPROACH' | 'SHOULDER' | 'OFF_CORRIDOR';
    routeDeviationMeters: number;
    waypointContext: string;
    locationName: string;
    coordinates: { lat: number; lng: number };
  };
  environment: {
    acousticContext: 'ROAD_NOISE' | 'TRAFFIC_CONGESTION' | 'SCREECH_ABRUPT' | 'SILENCE' | 'ENGINE_IDLE';
    acousticDecibels: number;
    visualContext: 'CLEAR_ROAD' | 'CONGESTION_AHEAD' | 'ROAD_SHOULDER' | 'TILTED_SURFACE' | 'OBSTACLE';
  };
  device: {
    mountedState: 'MOUNTED_SECURE' | 'VIBRATION_HIGH' | 'TILTED_ANGULAR' | 'FREE_FALL_DROP';
  };
  journey: {
    expectedState: JourneyState;
    recentHistory: string[];
  };
}

export interface EvaluatorResult {
  state: JourneyState;
  stage: CascadedStage;
  isAnomalyCandidate: boolean;
  gatingStatus: {
    motionGatePassed: boolean;
    micGated: 'STANDBY_GATED' | 'EVENT_TRIGGERED_ACTIVE';
    cameraGated: 'STANDBY_EPISODIC' | 'EVENT_TRIGGERED_CAPTURED';
  };
  anomalyReason: string;
  observedSignals: {
    speedTransition: string;
    stopDetected: boolean;
    corridorAlignment: string;
    tiltDescription: string;
  };
  consideredCauses: Array<{
    cause: 'Traffic' | 'Obstruction' | 'Intentional pull-over' | 'Possible incident';
    plausibility: 'high' | 'moderate' | 'unlikely' | 'ruled_out';
    evidence: string;
  }>;
  explanation: {
    noticed: string[];
    considered: string[];
    whyAsked: string[];
  };
  riderActionRequired: boolean;
}

export interface SensorData {
  speed: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroTilt: number;
  gnssFix: string;
  gnssAccuracy: string;
  audioClass: 'ROAD_NOISE' | 'TRAFFIC_CONGESTION' | 'SCREECH_ABRUPT' | 'SILENCE' | 'ENGINE_IDLE';
  audioDecibels: number;
  cameraClass: 'CLEAR_ROAD' | 'CONGESTION_AHEAD' | 'ROAD_SHOULDER' | 'TILTED_SURFACE' | 'OBSTACLE';
  deviceState: 'MOUNTED_SECURE' | 'VIBRATION_HIGH' | 'TILTED_ANGULAR' | 'FREE_FALL_DROP';
  evaluationLatencyMs: number; // local JS evaluation time (<1ms)
}

export interface JourneyContext {
  currentSpeed: number;
  targetSpeed: number;
  movementState: 'stable_cruising' | 'smooth_decel' | 'sudden_stop' | 'stationary' | 'unusual_impact';
  locationName: string;
  coordinates: { lat: number; lng: number };
  destinationName: string;
  routeProgress: number;
  routeDeviationMeters?: number;
  distanceRemainingKm: number;
  elapsedSeconds: number;
  etaMinutes: number;
  corridorStatus: 'PRIMARY_CORRIDOR' | 'TOLL_APPROACH' | 'SHOULDER' | 'OFF_CORRIDOR';
  nextJourneyContext: string;
  stopDurationSeconds: number;
  recentJourneyEvent: {
    title: string;
    description: string;
    timestamp: string;
    severity: 'normal' | 'info' | 'warning' | 'danger';
  };
  simulationPhase?: string;
  observedAnomalyReason: string;
  fusedConfidence: number;
  interpretations?: {
    traffic: number;
    temporaryStop: number;
    intentionalStop: number;
    possibleIncident: number;
  };
  riderResponse: 'NONE' | 'IM_OKAY' | 'NEED_HELP';
  sosDispatched: boolean;
  structuredInput?: StructuredSensorContext;
  evaluatorResult?: EvaluatorResult;
  cascadedStage?: CascadedStage;
  sensorGating?: {
    mic: 'STANDBY (GATED)' | 'ACTIVE (EVALUATED)';
    camera: 'STANDBY (EPISODIC)' | 'ACTIVE (EVALUATED)';
    motion: 'LOW-POWER BASELINE' | 'ANOMALY DETECTED';
    stage: 'BASELINE MONITORING' | 'MOTION GATE' | 'ANOMALY CANDIDATE' | 'CONTEXT VALIDATION' | 'JOURNEY STATE';
  };
}

export interface TimelineEvent {
  id: string;
  timeString: string;
  state: JourneyState;
  title: string;
  description: string;
  severity: 'normal' | 'info' | 'warning' | 'danger';
  telemetrySnapshot?: {
    speed: number;
    accel: number;
    sensor: string;
  };
}

export interface TripItem {
  id: string;
  dateLabel: string;
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  statusText: string;
  statusType: 'normal' | 'warning' | 'danger';
  sequence: string;
  events: {
    time: string;
    label: string;
    detail: string;
  }[];
}
