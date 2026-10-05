import { StructuredSensorContext, EvaluatorResult, CascadedStage, JourneyState } from '../types/journey';

/**
 * Local Deterministic Journey-State Evaluator
 * 
 * ARCHITECTURE IMPLEMENTATION:
 * SIMULATED SENSOR / CONTEXT INPUTS
 *         ↓
 * SIGNAL PREPROCESSING (Threshold & Delta Extraction)
 *         ↓
 * ANOMALY CANDIDATE (Motion Gate)
 *         ↓
 * CONTEXT VALIDATION (Event-Gated Audio, Vision, Corridor, Device State)
 *         ↓
 * JOURNEY STATE (Deterministic State Machine)
 *         ↓
 * RIDER RESPONSE / EXPLAINABILITY
 */
export function evaluateJourneyContext(input: StructuredSensorContext): EvaluatorResult {
  const { movement, location, environment, device } = input;
  
  // 1. SIGNAL PREPROCESSING
  const speedDelta = movement.previousSpeed - movement.currentSpeed;
  const isStandstill = movement.currentSpeed === 0;
  const isSevereDecel = movement.deceleration <= -5.0; // m/s^2
  const isModerateDecel = (movement.deceleration <= -0.5 && movement.deceleration > -5.0) || speedDelta >= 2;
  const isAbnormalTilt = movement.tiltAngle >= 70 || device.mountedState === 'TILTED_ANGULAR';
  const isPullOverTilt = movement.tiltAngle >= 52 && movement.tiltAngle < 70;

  // 2. MOTION GATE (Cascaded Sensing Stage 1 -> Stage 2)
  // Low-cost motion gate checks if movement profile deviates from stable cruising
  const motionGatePassed = movement.deceleration <= -1.2 || speedDelta >= 5 || isStandstill || isAbnormalTilt;

  // 3. ANOMALY CANDIDATE (Stage 3)
  const isAnomalyCandidate = motionGatePassed && (speedDelta >= 20 || isStandstill || isAbnormalTilt);

  // 4. CONTEXT VALIDATION (Stage 4) - Simulated Event Gating
  // Simulated microphone and camera classification are evaluated only when motion gate is triggered
  const micGated = motionGatePassed ? 'EVENT_TRIGGERED_ACTIVE' as const : 'STANDBY_GATED' as const;
  const cameraGated = motionGatePassed ? 'EVENT_TRIGGERED_CAPTURED' as const : 'STANDBY_EPISODIC' as const;

  // 5. HYPOTHESES & PLAUSIBILITY EVALUATION
  // Evaluate the four candidate explanations defined in the PPT
  const consideredCauses: EvaluatorResult['consideredCauses'] = [
    {
      cause: 'Traffic',
      plausibility: 'unlikely',
      evidence: 'No traffic pattern detected.',
    },
    {
      cause: 'Obstruction',
      plausibility: 'unlikely',
      evidence: 'Standard corridor path.',
    },
    {
      cause: 'Intentional pull-over',
      plausibility: 'unlikely',
      evidence: 'Vehicle position on travel lane.',
    },
    {
      cause: 'Possible incident',
      plausibility: 'unlikely',
      evidence: 'No incident signatures detected.',
    },
  ];

  let evaluatedState: JourneyState = 'NORMAL';
  let cascadedStage: CascadedStage = 'LOW_POWER_BASELINE';
  let anomalyReason = '';
  let riderActionRequired = false;

  // RULE A: POSSIBLE INCIDENT
  // Abnormal vehicle angular tilt (>=70° or TILTED_ANGULAR) with standstill on corridor
  if (isAbnormalTilt || (isStandstill && environment.visualContext === 'TILTED_SURFACE')) {
    evaluatedState = 'POSSIBLE_INCIDENT';
    cascadedStage = 'STATE_DETERMINED';
    anomalyReason = `Anomalous vehicle angular tilt (${movement.tiltAngle}°) detected with sustained zero velocity on corridor.`;
    riderActionRequired = true;

    consideredCauses[0] = { cause: 'Traffic', plausibility: 'ruled_out', evidence: 'Corridor speed profile does not match traffic flow.' };
    consideredCauses[1] = { cause: 'Obstruction', plausibility: 'unlikely', evidence: 'Obstruction does not account for severe tilt/acoustic spike.' };
    consideredCauses[2] = { cause: 'Intentional pull-over', plausibility: 'unlikely', evidence: 'Abnormal vehicle angle inconsistent with intentional stand.' };
    consideredCauses[3] = { cause: 'Possible incident', plausibility: 'high', evidence: `Severe tilt (${movement.tiltAngle}°) and abrupt standstill indicate safety anomaly.` };
  }
  // RULE B: ORDINARY CHANGE (Traffic Slowdown / Flow Compression)
  // Gradual/smooth deceleration or sustained slow speed in congestion, still moving (>=8 km/h), traffic acoustic/visual context, upright mount
  else if ((isModerateDecel || movement.currentSpeed <= 30) && movement.currentSpeed >= 8 && (environment.acousticContext === 'TRAFFIC_CONGESTION' || environment.visualContext === 'CONGESTION_AHEAD' || location.corridorStatus === 'TOLL_APPROACH')) {
    evaluatedState = 'ORDINARY_CHANGE';
    cascadedStage = 'STATE_DETERMINED';
    anomalyReason = `Gradual deceleration (${movement.previousSpeed} → ${movement.currentSpeed} km/h) matching urban traffic flow pattern.`;
    riderActionRequired = false;

    consideredCauses[0] = { cause: 'Traffic', plausibility: 'high', evidence: 'Acoustic background and visual congestion match corridor flow.' };
    consideredCauses[1] = { cause: 'Obstruction', plausibility: 'moderate', evidence: 'Possible localized queue or toll approach.' };
    consideredCauses[2] = { cause: 'Intentional pull-over', plausibility: 'unlikely', evidence: 'Vehicle maintains lane and forward movement.' };
    consideredCauses[3] = { cause: 'Possible incident', plausibility: 'ruled_out', evidence: 'Deceleration within normal braking threshold; vehicle upright.' };
  }
  // RULE C: MEANINGFUL CHANGE (Unexpected Stop / Unresolved Cause / Roadside Pull-Over)
  // Vehicle stopped rapidly (42 -> 0 km/h), upright or dismount tilt, cause unresolved
  else if (isStandstill || (isSevereDecel && movement.currentSpeed <= 5)) {
    evaluatedState = 'MEANINGFUL_CHANGE';
    cascadedStage = 'CONTEXT_VALIDATION';
    riderActionRequired = true;

    if (location.corridorStatus === 'SHOULDER' || isPullOverTilt) {
      anomalyReason = `Planned/intentional roadside pull-over suspected near shoulder. Awaiting rider confirmation.`;
      consideredCauses[0] = { cause: 'Traffic', plausibility: 'ruled_out', evidence: 'Zero speed on road shoulder while traffic flows.' };
      consideredCauses[1] = { cause: 'Obstruction', plausibility: 'unlikely', evidence: 'Vehicle moved safely out of primary lane.' };
      consideredCauses[2] = { cause: 'Intentional pull-over', plausibility: 'high', evidence: 'Shoulder waypoint and dismount posture (58° tilt).' };
      consideredCauses[3] = { cause: 'Possible incident', plausibility: 'moderate', evidence: 'Corridor stop requires confirmation before escalation.' };
    } else {
      anomalyReason = `Sudden corridor stop (${movement.previousSpeed} → 0 km/h in 1.1s). Context inconclusive; rider confirmation requested.`;
      consideredCauses[0] = { cause: 'Traffic', plausibility: 'unlikely', evidence: 'Isolated stop on primary corridor without general congestion.' };
      consideredCauses[1] = { cause: 'Obstruction', plausibility: 'moderate', evidence: 'Temporary roadblock or animal hazard possible.' };
      consideredCauses[2] = { cause: 'Intentional pull-over', plausibility: 'moderate', evidence: 'Rider may have pulled over for navigation or call.' };
      consideredCauses[3] = { cause: 'Possible incident', plausibility: 'moderate', evidence: 'Unresolved corridor stop requires rider check before action.' };
    }
  }
  // RULE D: NORMAL CRUISING BASELINE
  else {
    evaluatedState = 'NORMAL';
    cascadedStage = motionGatePassed ? 'MOTION_GATE' : 'LOW_POWER_BASELINE';
    anomalyReason = 'Normal riding dynamics on primary corridor.';
    riderActionRequired = false;

    consideredCauses[0] = { cause: 'Traffic', plausibility: 'ruled_out', evidence: 'Speed consistent with corridor limit.' };
    consideredCauses[1] = { cause: 'Obstruction', plausibility: 'ruled_out', evidence: 'Corridor clear.' };
    consideredCauses[2] = { cause: 'Intentional pull-over', plausibility: 'ruled_out', evidence: 'Vehicle cruising steadily.' };
    consideredCauses[3] = { cause: 'Possible incident', plausibility: 'ruled_out', evidence: 'All motion and tilt metrics normal.' };
  }

  // 6. DYNAMIC STRUCTURED EXPLAINABILITY
  const noticed: string[] = [
    `Speed transition: ${movement.previousSpeed} → ${movement.currentSpeed} km/h (Decel: ${movement.deceleration.toFixed(1)} m/s²)`,
    isStandstill ? 'Full vehicle standstill detected on planned corridor' : `Cruising speed: ${movement.currentSpeed} km/h`,
    `Corridor status: ${location.waypointContext} (${location.corridorStatus.replace('_', ' ')})`,
    `Device posture: ${device.mountedState.replace('_', ' ')} (Tilt: ${movement.tiltAngle}°)`,
  ];

  const considered: string[] = consideredCauses.map(
    (c) => `${c.cause} [${c.plausibility.toUpperCase()}]: ${c.evidence}`
  );

  const whyAsked: string[] = evaluatedState === 'MEANINGFUL_CHANGE'
    ? [
        'The journey change was meaningful (unexpected stop on active corridor).',
        'Multi-sensor context is inconclusive between a planned pull-over and a mechanical issue.',
        'RideGuard requests 1-tap rider confirmation before triggering emergency assistance.',
      ]
    : evaluatedState === 'ORDINARY_CHANGE'
    ? [
        'Deceleration matches normal traffic compression on this corridor.',
        'Vehicle remains upright and moving with surrounding flow.',
        'Silent adaptation: no rider interruption necessary.',
      ]
    : evaluatedState === 'POSSIBLE_INCIDENT'
    ? [
        'Severe deceleration combined with abnormal vehicle tilt (78°).',
        'Safety anomaly profile detected.',
        'Assistance mode activated with preserved location payload.',
      ]
    : [
        'Journey metrics within normal operating envelope.',
        'Low-power background monitoring active.',
      ];

  return {
    state: evaluatedState,
    stage: cascadedStage,
    isAnomalyCandidate,
    gatingStatus: {
      motionGatePassed,
      micGated,
      cameraGated,
    },
    anomalyReason,
    observedSignals: {
      speedTransition: `${movement.previousSpeed} → ${movement.currentSpeed} km/h`,
      stopDetected: isStandstill,
      corridorAlignment: location.corridorStatus,
      tiltDescription: `${movement.tiltAngle}° (${device.mountedState.replace('_', ' ')})`,
    },
    consideredCauses,
    explanation: {
      noticed,
      considered,
      whyAsked,
    },
    riderActionRequired,
  };
}

// ==========================================
// PRESET INPUT GENERATORS FOR DETERMINISTIC DEMO
// ==========================================

export function createCruisingContext(): StructuredSensorContext {
  return {
    scenarioId: 'sc-normal',
    scenarioName: 'Normal Highway Cruising',
    movement: {
      previousSpeed: 40,
      currentSpeed: 42,
      deceleration: 0.2,
      stopDuration: 0,
      tiltAngle: 45,
    },
    location: {
      corridorStatus: 'PRIMARY_CORRIDOR',
      routeDeviationMeters: 0,
      waypointContext: 'PVNR Expressway towards Outer Ring Road',
      locationName: 'PVNR Expressway, Hyderabad',
      coordinates: { lat: 17.4125, lng: 78.3984 },
    },
    environment: {
      acousticContext: 'ROAD_NOISE',
      acousticDecibels: 66,
      visualContext: 'CLEAR_ROAD',
    },
    device: {
      mountedState: 'MOUNTED_SECURE',
    },
    journey: {
      expectedState: 'NORMAL',
      recentHistory: ['Cruising at 42 km/h on corridor'],
    },
  };
}

export function createTrafficSlowdownContext(): StructuredSensorContext {
  return {
    scenarioId: 'sc-traffic',
    scenarioName: 'Normal Traffic Slowdown',
    movement: {
      previousSpeed: 42,
      currentSpeed: 14,
      deceleration: -1.8,
      stopDuration: 0,
      tiltAngle: 44,
    },
    location: {
      corridorStatus: 'TOLL_APPROACH',
      routeDeviationMeters: 0,
      waypointContext: 'Medchal Toll Plaza Approach (Urban Flow)',
      locationName: 'Medchal Toll Plaza Approach',
      coordinates: { lat: 17.4950, lng: 78.4210 },
    },
    environment: {
      acousticContext: 'TRAFFIC_CONGESTION',
      acousticDecibels: 72,
      visualContext: 'CONGESTION_AHEAD',
    },
    device: {
      mountedState: 'MOUNTED_SECURE',
    },
    journey: {
      expectedState: 'ORDINARY_CHANGE',
      recentHistory: ['Cruising at 42 km/h', 'Traffic compression detected'],
    },
  };
}

export function createAbruptStopContext(): StructuredSensorContext {
  return {
    scenarioId: 'sc-meaningful',
    scenarioName: 'Unexpected Corridor Stop',
    movement: {
      previousSpeed: 42,
      currentSpeed: 0,
      deceleration: -6.8,
      stopDuration: 2,
      tiltAngle: 52,
    },
    location: {
      corridorStatus: 'PRIMARY_CORRIDOR',
      routeDeviationMeters: 0,
      waypointContext: 'ORR Exit 5, Near Dulapally Link Road',
      locationName: 'ORR Exit 5, Near Dulapally Link Road',
      coordinates: { lat: 17.5812, lng: 78.4619 },
    },
    environment: {
      acousticContext: 'SCREECH_ABRUPT',
      acousticDecibels: 81,
      visualContext: 'ROAD_SHOULDER',
    },
    device: {
      mountedState: 'VIBRATION_HIGH',
    },
    journey: {
      expectedState: 'MEANINGFUL_CHANGE',
      recentHistory: ['Cruising at 42 km/h', 'Abrupt deceleration', 'Vehicle standstill'],
    },
  };
}

export function createRoadsidePullOverContext(): StructuredSensorContext {
  return {
    scenarioId: 'sc-pullover',
    scenarioName: 'Intentional Roadside Pull-Over',
    movement: {
      previousSpeed: 42,
      currentSpeed: 0,
      deceleration: -4.2,
      stopDuration: 5,
      tiltAngle: 58,
    },
    location: {
      corridorStatus: 'SHOULDER',
      routeDeviationMeters: 2,
      waypointContext: 'Highway Shoulder Lay-by, Mile 18',
      locationName: 'Highway Shoulder Lay-by, ORR Mile 18',
      coordinates: { lat: 17.5521, lng: 78.4350 },
    },
    environment: {
      acousticContext: 'ENGINE_IDLE',
      acousticDecibels: 54,
      visualContext: 'ROAD_SHOULDER',
    },
    device: {
      mountedState: 'MOUNTED_SECURE',
    },
    journey: {
      expectedState: 'MEANINGFUL_CHANGE',
      recentHistory: ['Cruising at 42 km/h', 'Smooth lane shift to shoulder', 'Standstill'],
    },
  };
}

export function createPossibleIncidentContext(): StructuredSensorContext {
  return {
    scenarioId: 'sc-incident',
    scenarioName: 'Severe Impact & Angular Tilt',
    movement: {
      previousSpeed: 42,
      currentSpeed: 0,
      deceleration: -7.2,
      stopDuration: 8,
      tiltAngle: 78,
    },
    location: {
      corridorStatus: 'PRIMARY_CORRIDOR',
      routeDeviationMeters: 0,
      waypointContext: 'Outer Ring Road Link, Sector 4',
      locationName: 'Outer Ring Road Link, Sector 4',
      coordinates: { lat: 17.5910, lng: 78.4720 },
    },
    environment: {
      acousticContext: 'SCREECH_ABRUPT',
      acousticDecibels: 88,
      visualContext: 'TILTED_SURFACE',
    },
    device: {
      mountedState: 'TILTED_ANGULAR',
    },
    journey: {
      expectedState: 'POSSIBLE_INCIDENT',
      recentHistory: ['Cruising at 42 km/h', 'Abrupt impact deceleration', 'Abnormal tilt 78°'],
    },
  };
}
