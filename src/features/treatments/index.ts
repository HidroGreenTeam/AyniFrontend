// Export components
export { TreatmentStepsManager } from './components/TreatmentStepsManager';
export { TreatmentQuickActions } from './components/TreatmentQuickActions';

// Export hooks
export { useTreatments, useTreatmentDetails, useAIRecommendations, useTreatmentReminders } from './hooks/useTreatments';

// Export services  
export * from './services/treatment';
export * from './services/aiRecommendations';

// Export types
export type { Treatment, TreatmentStep, StepInput } from './services/treatment';
export type { AITreatmentRecommendation } from './services/aiRecommendations'; 