'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, X } from 'lucide-react';
import { 
  completeStep, 
  skipStep, 
  getStatusColor, 
  getStatusText 
} from '../services/treatment';
import { TreatmentStep } from '../services/treatment';

interface TreatmentQuickActionsProps {
  steps: TreatmentStep[];
  onStepUpdated?: () => void;
}

export function TreatmentQuickActions({ steps, onStepUpdated }: TreatmentQuickActionsProps) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleCompleteStep = async (stepId: number) => {
    setLoading(stepId);
    try {
      await completeStep(stepId);
      onStepUpdated?.();
    } catch (error) {
      console.error('Error completing step:', error);
      alert('Error al completar el paso');
    } finally {
      setLoading(null);
    }
  };

  const handleSkipStep = async (stepId: number) => {
    setLoading(stepId);
    try {
      await skipStep(stepId);
      onStepUpdated?.();
    } catch (error) {
      console.error('Error skipping step:', error);
      alert('Error al omitir el paso');
    } finally {
      setLoading(null);
    }
  };

  const pendingSteps = steps.filter(step => 
    step.status !== 'completed' && step.status !== 'skipped'
  );

  if (pendingSteps.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
          <span className="text-green-800 dark:text-green-200 font-medium">
            ¡Todos los pasos completados!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Acciones rápidas ({pendingSteps.length} pasos pendientes)
      </h4>
      
      {pendingSteps.slice(0, 3).map((step) => {
        const statusColor = getStatusColor(step.status);
        const isLoading = loading === step.id;
        
        return (
          <div 
            key={step.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {step.name}
                  </h5>
                  <span className={`px-2 py-1 text-xs rounded-full bg-${statusColor}-100 dark:bg-${statusColor}-900/30 text-${statusColor}-800 dark:text-${statusColor}-200`}>
                    {getStatusText(step.status)}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(step.scheduledDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-3">
                <button
                  onClick={() => handleCompleteStep(step.id)}
                  disabled={isLoading}
                  className="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                  title="Completar paso"
                >
                  {isLoading ? (
                    <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent"></div>
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                </button>
                
                <button
                  onClick={() => handleSkipStep(step.id)}
                  disabled={isLoading}
                  className="p-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  title="Omitir paso"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {pendingSteps.length > 3 && (
        <div className="text-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Y {pendingSteps.length - 3} pasos más...
          </span>
        </div>
      )}
    </div>
  );
} 