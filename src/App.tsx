import React, { useState, useEffect, useRef } from 'react';
import { JourneyState, MainTab, TechModal, SensorData, JourneyContext, StructuredSensorContext, TripItem, TimelineEvent } from './types/journey';
import { JourneyStateEngine } from './engine/journeyEngine';
import { SensorSimulator } from './engine/sensorSimulator';
import { PhoneFrame } from './components/phone/PhoneFrame';
import { TopBar } from './components/navigation/TopBar';
import { PrimaryNavBar } from './components/navigation/PrimaryNavBar';
import { RideReadyScreen } from './components/screens/RideReadyScreen';
import { ActiveJourneyScreen } from './components/screens/ActiveJourneyScreen';
import { JourneyChangeScreen } from './components/screens/JourneyChangeScreen';
import { ContextAnalysisScreen } from './components/screens/ContextAnalysisScreen';
import { RiderConfirmationScreen } from './components/screens/RiderConfirmationScreen';
import { JourneyNormalRecoveredScreen } from './components/screens/JourneyNormalRecoveredScreen';
import { IncidentModeScreen } from './components/screens/IncidentModeScreen';
import { TripsScreen } from './components/screens/TripsScreen';
import { GroupScreen } from './components/screens/GroupScreen';
import { YouScreen } from './components/screens/YouScreen';
import { WhyExplanationModal } from './components/modals/WhyExplanationModal';
import { TechInspectorView } from './components/views/TechInspectorView';
import { OfficeKitExpandedView } from './components/views/OfficeKitExpandedView';
import { IntelligencePipelineView } from './components/views/IntelligencePipelineView';
import { HardwareIntegrationView } from './components/views/HardwareIntegrationView';
import { EdgeArchitectureView } from './components/views/EdgeArchitectureView';
import { PrivacyDataView } from './components/views/PrivacyDataView';
import { ScenarioLabView } from './components/views/ScenarioLabView';
import { DemoController } from './components/demo/DemoController';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { RidePreferencesModal } from './components/modals/RidePreferencesModal';
import { EmergencyContactsModal } from './components/modals/EmergencyContactsModal';

const initialEngine = new JourneyStateEngine();
const initialSimulator = new SensorSimulator();

export function App() {
  const engineRef = useRef<JourneyStateEngine>(initialEngine);
  const simulatorRef = useRef<SensorSimulator>(initialSimulator);

  const [journeyState, setJourneyState] = useState<JourneyState>('READY');
  const [currentTab, setCurrentTab] = useState<MainTab>('RIDE');
  const [activeTechModal, setActiveTechModal] = useState<TechModal>('NONE');
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isDemoConsoleOpen, setIsDemoConsoleOpen] = useState<boolean>(false);

  const [context, setContext] = useState<JourneyContext>(initialEngine.getContext());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(initialEngine.getTimeline());
  const [trips, setTrips] = useState<TripItem[]>(initialEngine.getCompletedTrips());
  const [sensor, setSensor] = useState<SensorData>(
    initialSimulator.getSensorSnapshotFromContext(initialEngine.getStructuredInput(), 'READY')
  );
  
  const [isFrameEnabled, setIsFrameEnabled] = useState<boolean>(true);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Sync state engine
  const refreshEngineState = () => {
    const st = engineRef.current.getState();
    const ctx = engineRef.current.getContext();
    const tl = engineRef.current.getTimeline();
    const tr = engineRef.current.getCompletedTrips();
    setJourneyState(st);
    setContext(ctx);
    setTimeline(tl);
    setTrips(tr);
  };

  // Continuous sensor loop & telemetry tick
  useEffect(() => {
    const interval = setInterval(() => {
      engineRef.current.updateTelemetryTick(1);
      const currentSt = engineRef.current.getState();
      const currentCtx = engineRef.current.getContext();
      const currentSensor = simulatorRef.current.getSensorSnapshotFromContext(
        engineRef.current.getStructuredInput(),
        currentSt
      );
      
      setJourneyState(currentSt);
      setContext({ ...currentCtx });
      setSensor(currentSensor);
      setTimeline(engineRef.current.getTimeline());
      setTrips(engineRef.current.getCompletedTrips());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handlers for Ride Flow (Now driven by causal scenario inputs!)
  const handleStartRide = () => {
    engineRef.current.startRide();
    refreshEngineState();
    setCurrentTab('RIDE');
  };

  const handleTriggerOrdinaryChange = () => {
    engineRef.current.triggerOrdinaryChange();
    refreshEngineState();
    setCurrentTab('RIDE');
  };

  const handleTriggerMeaningfulChange = () => {
    engineRef.current.triggerMeaningfulChange();
    refreshEngineState();
    setCurrentTab('RIDE');
  };

  const handleProceedToContextAnalysis = () => {
    engineRef.current.enterContextAnalysis();
    refreshEngineState();
  };

  const handleProceedToConfirmation = () => {
    engineRef.current.enterRiderConfirmation();
    refreshEngineState();
  };

  const handleConfirmImOkay = () => {
    engineRef.current.respondImOkay();
    refreshEngineState();
  };

  const handleConfirmNeedHelp = () => {
    engineRef.current.respondNeedHelp();
    refreshEngineState();
  };

  const handleTriggerPossibleIncident = () => {
    engineRef.current.triggerDirectIncident();
    refreshEngineState();
    setCurrentTab('RIDE');
  };

  const handleReturnToActiveJourney = () => {
    engineRef.current.continueActiveJourney();
    refreshEngineState();
    setCurrentTab('RIDE');
  };

  const handleEndRide = () => {
    engineRef.current.endRide();
    refreshEngineState();
    setCurrentTab('TRIPS'); // show completed trip log
  };

  const handleResetJourney = () => {
    engineRef.current.resetJourney();
    engineRef.current.startRide();
    refreshEngineState();
    setCurrentTab('RIDE');
    setActiveTechModal('NONE');
    setIsWhyModalOpen(false);
    setIsEmergencyOpen(false);
  };

  const handleLoadScenarioInput = (input: StructuredSensorContext) => {
    engineRef.current.applySensorContext(input);
    refreshEngineState();
    setCurrentTab('RIDE');
    setActiveTechModal('NONE');
  };

  const isRiding = journeyState !== 'READY';

  return (
    <main className="min-h-screen bg-[#040507] text-slate-100 flex flex-col justify-center items-center select-none font-['Outfit']">
      <PhoneFrame isFrameEnabled={isFrameEnabled}>
        {/* Top Header Bar */}
        <TopBar
          onOpenDemoConsole={() => setIsDemoConsoleOpen(true)}
        />

        {/* Dynamic Screen Content Container */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          {/* TAB 1: RIDE (MAIN SCREEN — 80% OF EXPERIENCE) */}
          {currentTab === 'RIDE' && (
            <div className="flex-1 overflow-hidden">
              {journeyState === 'READY' && (
                <RideReadyScreen
                  context={context}
                  onStartRide={handleStartRide}
                />
              )}

              {(journeyState === 'NORMAL' || journeyState === 'ORDINARY_CHANGE') && (
                <ActiveJourneyScreen
                  context={context}
                  state={journeyState}
                  onEndRide={handleEndRide}
                />
              )}

              {journeyState === 'MEANINGFUL_CHANGE' && (
                <JourneyChangeScreen
                  onProceedToContextAnalysis={handleProceedToContextAnalysis}
                  onOpenWhy={() => setIsWhyModalOpen(true)}
                />
              )}

              {journeyState === 'CONTEXT_ANALYSIS' && (
                <ContextAnalysisScreen
                  onProceedToConfirmation={handleProceedToConfirmation}
                />
              )}

              {journeyState === 'RIDER_CONFIRMATION' && (
                <RiderConfirmationScreen
                  onConfirmImOkay={handleConfirmImOkay}
                  onConfirmNeedHelp={handleConfirmNeedHelp}
                  onOpenWhy={() => setIsWhyModalOpen(true)}
                />
              )}

              {journeyState === 'NORMAL_RECOVERED' && (
                <JourneyNormalRecoveredScreen
                  onReturnToJourney={handleReturnToActiveJourney}
                />
              )}

              {(journeyState === 'POSSIBLE_INCIDENT' || journeyState === 'ASSIST') && (
                <IncidentModeScreen
                  context={context}
                  onCancelIncident={handleReturnToActiveJourney}
                  onOpenEmergencyModal={() => setIsEmergencyOpen(true)}
                />
              )}
            </div>
          )}

          {/* TAB 2: TRIPS (Dynamic Session History) */}
          {currentTab === 'TRIPS' && (
            <TripsScreen trips={trips} />
          )}

          {/* TAB 3: GROUP (Mesh Preview) */}
          {currentTab === 'GROUP' && (
            <GroupScreen />
          )}

          {/* TAB 4: YOU */}
          {currentTab === 'YOU' && (
            <YouScreen
              onOpenRidePreferences={() => setActiveTechModal('RIDE_PREFERENCES')}
              onOpenEmergencyContacts={() => setActiveTechModal('EMERGENCY_CONTACTS')}
              onOpenSettings={() => setActiveTechModal('SETTINGS')}
              onOpenPrivacy={() => setActiveTechModal('PRIVACY')}
              onOpenDemoConsole={() => setIsDemoConsoleOpen(true)}
            />
          )}
        </div>

        {/* Primary Bottom Navigation (RIDE, TRIPS, GROUP, YOU) */}
        <PrimaryNavBar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setActiveTechModal('NONE');
          }}
          isRiding={isRiding}
        />
      </PhoneFrame>

      {/* Floating Demo Controller / Judge Trigger */}
      <DemoController
        currentState={journeyState}
        onSetNormal={handleStartRide}
        onTriggerOrdinaryChange={handleTriggerOrdinaryChange}
        onTriggerMeaningfulChange={handleTriggerMeaningfulChange}
        onTriggerPossibleIncident={handleTriggerPossibleIncident}
        onOpenGroupRide={() => setCurrentTab('GROUP')}
        onOpenOfficeKit={() => setActiveTechModal('OFFICE_KIT')}
        onOpenTechModal={(m) => setActiveTechModal(m)}
        onOpenWhy={() => setIsWhyModalOpen(true)}
        onReset={handleResetJourney}
        isOpen={isDemoConsoleOpen}
        onToggleOpen={() => setIsDemoConsoleOpen(!isDemoConsoleOpen)}
      />

      {/* "WHY DID THIS CHANGE?" Dynamic Explainability Modal */}
      {isWhyModalOpen && (
        <WhyExplanationModal
          state={journeyState}
          context={context}
          onClose={() => setIsWhyModalOpen(false)}
        />
      )}

      {/* TECHNICAL SURFACES & JUDGE MODALS */}
      {/* 1. Technical View (50Hz Stream with DEMO DATA badge) */}
      {activeTechModal === 'TECH_INSPECTOR' && (
        <TechInspectorView
          sensor={sensor}
          state={journeyState}
          context={context}
          timeline={timeline}
          onClose={() => setActiveTechModal('NONE')}
        />
      )}

      {/* 2. Office Kit (Consumes live timeline events!) */}
      {activeTechModal === 'OFFICE_KIT' && (
        <div className="fixed inset-0 z-50 bg-[#07080B] flex flex-col justify-center items-center">
          <PhoneFrame isFrameEnabled={isFrameEnabled}>
            <OfficeKitExpandedView
              timeline={timeline}
              context={context}
              onBack={() => setActiveTechModal('NONE')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* 3. Intelligence Pipeline */}
      {activeTechModal === 'PIPELINE' && (
        <div className="fixed inset-0 z-50 bg-[#07080B] flex flex-col justify-center items-center">
          <PhoneFrame isFrameEnabled={isFrameEnabled}>
            <IntelligencePipelineView
              currentStage={context.sensorGating?.stage}
              currentState={journeyState}
              onBack={() => setActiveTechModal('NONE')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* 4. iQOO Hardware Integration */}
      {activeTechModal === 'HARDWARE' && (
        <div className="fixed inset-0 z-50 bg-[#07080B] flex flex-col justify-center items-center">
          <PhoneFrame isFrameEnabled={isFrameEnabled}>
            <HardwareIntegrationView
              onBack={() => setActiveTechModal('NONE')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* 5. Edge Architecture */}
      {activeTechModal === 'EDGE_ARCH' && (
        <div className="fixed inset-0 z-50 bg-[#07080B] flex flex-col justify-center items-center">
          <PhoneFrame isFrameEnabled={isFrameEnabled}>
            <EdgeArchitectureView
              onBack={() => setActiveTechModal('NONE')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* 6. Settings */}
      {activeTechModal === 'SETTINGS' && (
        <SettingsModal
          isFrameEnabled={isFrameEnabled}
          onToggleFrame={() => setIsFrameEnabled(!isFrameEnabled)}
          onClose={() => setActiveTechModal('NONE')}
        />
      )}

      {/* 7. Privacy & Data */}
      {activeTechModal === 'PRIVACY' && (
        <div className="fixed inset-0 z-50 bg-[#07080B] flex flex-col justify-center items-center">
          <PhoneFrame isFrameEnabled={isFrameEnabled}>
            <PrivacyDataView
              onBack={() => setActiveTechModal('NONE')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* 8. Scenario Lab (Causal Evaluator) */}
      {activeTechModal === 'SCENARIO_LAB' && (
        <ScenarioLabView
          onLoadScenarioInput={handleLoadScenarioInput}
          onClose={() => setActiveTechModal('NONE')}
        />
      )}

      {/* 9. Ride Preferences */}
      {activeTechModal === 'RIDE_PREFERENCES' && (
        <RidePreferencesModal
          onClose={() => setActiveTechModal('NONE')}
        />
      )}

      {/* 10. Emergency Contacts */}
      {activeTechModal === 'EMERGENCY_CONTACTS' && (
        <EmergencyContactsModal
          onClose={() => setActiveTechModal('NONE')}
        />
      )}

      {/* Emergency Assistance Modal */}
      {isEmergencyOpen && (
        <EmergencyModal
          context={context}
          onClose={() => setIsEmergencyOpen(false)}
        />
      )}
    </main>
  );
}

export default App;
