'use client';

import { useState, useCallback } from 'react';
import { 
  Bot, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  X,
  AlertTriangle,
  Pill
} from 'lucide-react';
import { useTreatmentDetails } from '../hooks/useTreatments';
import { useAIRecommendations } from '../hooks/useTreatments';
import { StepInput } from '../services/treatment';
import { Diagnosis } from '@/features/diagnosis/types';

interface TreatmentStepsManagerProps {
  treatmentId: number;
  diagnosis?: Diagnosis;
  onStepCreated?: () => void;
}

interface StepRecommendation {
  name: string;
  description: string;
  scheduledDate: string;
  hasReminder: boolean;
  reminderMinutesBefore: number;
  priority: 'high' | 'medium' | 'low';
  category: 'prevention' | 'treatment' | 'monitoring';
  selected: boolean;
}

export function TreatmentStepsManager({ 
  treatmentId, 
  diagnosis,
  onStepCreated 
}: TreatmentStepsManagerProps) {
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [recommendedSteps, setRecommendedSteps] = useState<StepRecommendation[]>([]);
  const [savingSteps, setSavingSteps] = useState(false);
  const [manualStep, setManualStep] = useState<Partial<StepInput>>({
    name: '',
    description: '',
    scheduledDate: '',
    hasReminder: false,
    reminderMinutesBefore: 60
  });
  const [showManualForm, setShowManualForm] = useState(false);

  const {
    steps,
    createStep,
    completeStep,
    fetchTreatmentDetails
  } = useTreatmentDetails(treatmentId);

  const {
    recommendations,
    loading: aiLoading,
    generateRecommendations,
    formatForSteps
  } = useAIRecommendations();

  // Generar recomendaciones de IA
  const handleGenerateAIRecommendations = useCallback(async () => {
    if (!diagnosis) {
      alert('Se requiere un diagnóstico para generar recomendaciones');
      return;
    }

    try {
      const aiRecommendations = await generateRecommendations(diagnosis);
      const formattedSteps = formatForSteps(aiRecommendations);
      
      // Convertir a nuestro formato con selección
      const stepsWithSelection: StepRecommendation[] = aiRecommendations.steps.map((step, index) => ({
        name: step.name,
        description: step.description,
        scheduledDate: formattedSteps[index].scheduledDate,
        hasReminder: formattedSteps[index].hasReminder,
        reminderMinutesBefore: formattedSteps[index].reminderMinutesBefore,
        priority: step.priority,
        category: step.category,
        selected: true // Por defecto seleccionados
      }));

      setRecommendedSteps(stepsWithSelection);
      setShowAIRecommendations(true);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }
  }, [diagnosis, generateRecommendations, formatForSteps]);

  // Alternar selección de paso recomendado
  const toggleStepSelection = (index: number) => {
    setRecommendedSteps(prev => 
      prev.map((step, i) => 
        i === index ? { ...step, selected: !step.selected } : step
      )
    );
  };

  // Guardar pasos seleccionados
  const handleSaveSelectedSteps = useCallback(async () => {
    const selectedSteps = recommendedSteps.filter(step => step.selected);
    
    if (selectedSteps.length === 0) {
      alert('Selecciona al menos un paso para guardar');
      return;
    }

    setSavingSteps(true);
    try {
      // Crear cada paso seleccionado
      for (const step of selectedSteps) {
        const stepData: StepInput = {
          name: step.name,
          description: step.description,
          scheduledDate: step.scheduledDate,
          hasReminder: step.hasReminder,
          reminderMinutesBefore: step.reminderMinutesBefore
        };
        
        await createStep(stepData);
      }

      // Limpiar estado y cerrar modal
      setShowAIRecommendations(false);
      setRecommendedSteps([]);
      onStepCreated?.();
      
      // Refrescar los detalles del tratamiento
      fetchTreatmentDetails(treatmentId);
      
    } catch (error) {
      console.error('Error saving steps:', error);
      alert('Error al guardar los pasos. Inténtalo de nuevo.');
    } finally {
      setSavingSteps(false);
    }
  }, [recommendedSteps, createStep, onStepCreated, fetchTreatmentDetails, treatmentId]);

  // Crear paso manual
  const handleCreateManualStep = useCallback(async () => {
    if (!manualStep.name || !manualStep.description || !manualStep.scheduledDate) {
      alert('Completa todos los campos requeridos');
      return;
    }

    try {
      await createStep(manualStep as StepInput);
      
      // Limpiar formulario
      setManualStep({
        name: '',
        description: '',
        scheduledDate: '',
        hasReminder: false,
        reminderMinutesBefore: 60
      });
      setShowManualForm(false);
      onStepCreated?.();
      
      // Refrescar detalles
      fetchTreatmentDetails(treatmentId);
      
    } catch (error) {
      console.error('Error creating manual step:', error);
      alert('Error al crear el paso. Inténtalo de nuevo.');
    }
  }, [manualStep, createStep, onStepCreated, fetchTreatmentDetails, treatmentId]);

  // Completar paso
  const handleCompleteStep = useCallback(async (stepId: number) => {
    try {
      await completeStep(stepId);
      fetchTreatmentDetails(treatmentId);
    } catch (error) {
      console.error('Error completing step:', error);
      alert('Error al completar el paso. Inténtalo de nuevo.');
    }
  }, [completeStep, fetchTreatmentDetails, treatmentId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'treatment': return <Pill className="h-4 w-4" />;
      case 'prevention': return <AlertTriangle className="h-4 w-4" />;
      case 'monitoring': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pasos del Tratamiento
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Gestiona los pasos de este tratamiento
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateAIRecommendations}
            disabled={aiLoading || !diagnosis}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Bot className="h-4 w-4 mr-2" />
            {aiLoading ? 'Generando...' : 'IA Recomienda'}
          </button>
          
          <button
            onClick={() => setShowManualForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Paso
          </button>
        </div>
      </div>

      {/* Lista de pasos existentes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-white">
            Pasos Programados ({steps.length})
          </h4>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {steps.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Sin pasos programados
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Agrega pasos manualmente o usa las recomendaciones de IA
              </p>
            </div>
          ) : (
            steps.map((step) => (
              <div key={step.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {step.name}
                      </h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : step.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {step.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(step.scheduledDate).toLocaleDateString()}
                      </span>
                      {step.hasReminder && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Recordatorio {step.reminderMinutesBefore}min antes
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {step.status !== 'completed' && (
                    <button
                      onClick={() => handleCompleteStep(step.id)}
                      className="ml-4 flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Completar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de recomendaciones de IA */}
      {showAIRecommendations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recomendaciones de IA
                  </h3>
                </div>
                <button
                  onClick={() => setShowAIRecommendations(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {recommendations && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    <strong>Notas generales:</strong> {recommendations.generalNotes}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    <strong>Duración estimada:</strong> {recommendations.estimatedDuration}
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {recommendedSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 transition-all ${
                      step.selected 
                        ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={step.selected}
                        onChange={() => toggleStepSelection(index)}
                        className="mt-1 h-4 w-4 text-purple-600 rounded border-gray-300"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {step.name}
                          </h5>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(step.priority)}`}>
                            {step.priority}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            {getCategoryIcon(step.category)}
                            <span className="ml-1 capitalize">{step.category}</span>
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {step.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(step.scheduledDate).toLocaleDateString()}
                          </span>
                          {step.hasReminder && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Recordatorio {step.reminderMinutesBefore}min antes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowAIRecommendations(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSelectedSteps}
                disabled={savingSteps || recommendedSteps.filter(s => s.selected).length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savingSteps ? 'Guardando...' : `Guardar ${recommendedSteps.filter(s => s.selected).length} pasos`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de paso manual */}
      {showManualForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Agregar Paso Manual
                </h3>
                <button
                  onClick={() => setShowManualForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del paso *
                </label>
                <input
                  type="text"
                  value={manualStep.name || ''}
                  onChange={(e) => setManualStep(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Aplicación de fungicida"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={manualStep.description || ''}
                  onChange={(e) => setManualStep(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Describe detalladamente qué hacer en este paso..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha programada *
                </label>
                <input
                  type="datetime-local"
                  value={manualStep.scheduledDate || ''}
                  onChange={(e) => setManualStep(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="hasReminder"
                  checked={manualStep.hasReminder || false}
                  onChange={(e) => setManualStep(prev => ({ ...prev, hasReminder: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label htmlFor="hasReminder" className="text-sm text-gray-700 dark:text-gray-300">
                  Activar recordatorio
                </label>
              </div>
              
              {manualStep.hasReminder && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minutos antes del recordatorio
                  </label>
                  <select
                    value={manualStep.reminderMinutesBefore || 60}
                    onChange={(e) => setManualStep(prev => ({ ...prev, reminderMinutesBefore: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                    <option value={1440}>1 día</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowManualForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateManualStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear Paso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 