import { Diagnosis } from '@/features/diagnosis/types';

// Define AITreatmentRecommendation here since it's no longer in types
export interface AITreatmentRecommendation {
  steps: Array<{
    name: string;
    description: string;
    dayOffset: number;
    priority: 'high' | 'medium' | 'low';
    category: 'prevention' | 'treatment' | 'monitoring';
  }>;
  generalNotes: string;
  estimatedDuration: string;
}

/**
 * Servicio de Recomendaciones de IA para Tratamientos
 * Genera sugerencias inteligentes usando OpenAI 🤖
 */
export class AIRecommendationService {
  private static instance: AIRecommendationService;

  private constructor() {
    // Patrón Singleton
  }

  public static getInstance(): AIRecommendationService {
    if (!AIRecommendationService.instance) {
      AIRecommendationService.instance = new AIRecommendationService();
    }
    return AIRecommendationService.instance;
  }

  /**
   * Genera recomendaciones de tratamiento basadas en el diagnóstico
   */
  async generateTreatmentRecommendations(diagnosis: Diagnosis): Promise<AITreatmentRecommendation> {
    try {
      // const prompt = this.buildPrompt(diagnosis); // TODO: usar cuando implemente OpenAI real
      
      // Simulación de llamada a OpenAI (reemplazar con la implementación real)
      const response = await this.callOpenAI();
      
      return this.parseResponse(response);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return this.getFallbackRecommendations(diagnosis);
    }
  }

  /**
   * Construye el prompt para OpenAI basado en el diagnóstico
   */
  private buildPrompt(diagnosis: Diagnosis): string {
    const diseaseMap: { [key: string]: string } = {
      'rust': 'Roya del café',
      'leaf_spot': 'Ojo de gallo',
      'coffee_borer': 'Broca del café',
      'anthracnose': 'Antracnosis',
      'bacterial_blight': 'Tizón bacteriano',
      'healthy': 'Planta saludable'
    };

    const diseaseName = diseaseMap[diagnosis.predicted_class] || diagnosis.predicted_class;
    const confidence = Math.round(diagnosis.confidence * 100);

    return `
Eres un experto agrónomo especializado en cultivos de café. Un agricultor ha diagnosticado la siguiente condición en su plantación:

**Diagnóstico:**
- Enfermedad/Condición: ${diseaseName}
- Confianza del diagnóstico: ${confidence}%
- Fecha del diagnóstico: ${new Date(diagnosis.created_at).toLocaleDateString()}
- Requiere tratamiento: ${diagnosis.requires_treatment ? 'Sí' : 'No'}

**Instrucciones:**
Genera un plan de tratamiento detallado con pasos específicos, considerando:
1. Tratamiento inmediato (días 1-3)
2. Seguimiento a corto plazo (días 4-14)  
3. Monitoreo a largo plazo (días 15-30)
4. Medidas preventivas

Responde ÚNICAMENTE en el siguiente formato JSON (sin texto adicional):

{
  "steps": [
    {
      "name": "Nombre del paso",
      "description": "Descripción detallada de qué hacer",
      "dayOffset": 0,
      "priority": "high|medium|low",
      "category": "prevention|treatment|monitoring"
    }
  ],
  "generalNotes": "Notas generales sobre el tratamiento",
  "estimatedDuration": "Duración estimada del tratamiento completo"
}

Enfócate en soluciones prácticas y efectivas para caficultores.
    `;
  }

  /**
   * Simula llamada a OpenAI (implementar con API real)
   */
  private async callOpenAI(): Promise<string> {
    // NOTA: Aquí se debe implementar la llamada real a OpenAI
    // Por ahora devolvemos una respuesta simulada
    
    // TODO: Implementar llamada real a OpenAI API
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7,
    // });
    // return response.choices[0].message.content || '';

    // Respuesta simulada para desarrollo
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simula latencia
    
    return JSON.stringify({
      steps: [
        {
          name: "Aplicación de fungicida sistémico",
          description: "Aplicar fungicida con ingrediente activo triazol (como tebuconazol) en concentración del 0.1% al follaje afectado. Realizar en horas de la mañana temprano.",
          dayOffset: 0,
          priority: "high",
          category: "treatment"
        },
        {
          name: "Poda de material infectado",
          description: "Eliminar y quemar todas las hojas y ramas infectadas. Desinfectar herramientas entre cada planta con alcohol al 70%.",
          dayOffset: 1,
          priority: "high", 
          category: "treatment"
        },
        {
          name: "Mejora del drenaje",
          description: "Verificar y mejorar el drenaje del suelo alrededor de las plantas afectadas para reducir la humedad excesiva.",
          dayOffset: 2,
          priority: "medium",
          category: "prevention"
        },
        {
          name: "Segunda aplicación de fungicida",
          description: "Repetir la aplicación de fungicida siguiendo las mismas especificaciones de la primera aplicación.",
          dayOffset: 7,
          priority: "high",
          category: "treatment"
        },
        {
          name: "Inspección de seguimiento",
          description: "Revisar minuciosamente las plantas tratadas en busca de signos de recuperación o nuevos síntomas.",
          dayOffset: 14,
          priority: "medium",
          category: "monitoring"
        },
        {
          name: "Aplicación preventiva final",
          description: "Aplicar fungicida preventivo de amplio espectro para evitar reinfecciones.",
          dayOffset: 21,
          priority: "medium",
          category: "prevention"
        },
        {
          name: "Evaluación final del tratamiento",
          description: "Documentar el estado final de las plantas y efectividad del tratamiento aplicado.",
          dayOffset: 30,
          priority: "low",
          category: "monitoring"
        }
      ],
      generalNotes: "Mantener las plantas bien ventiladas y evitar el riego por aspersión. Aplicar fertilización balanceada para fortalecer las defensas naturales de la planta.",
      estimatedDuration: "30 días con seguimiento continuo"
    });
  }

  /**
   * Parsea la respuesta de OpenAI a nuestro formato
   */
  private parseResponse(response: string): AITreatmentRecommendation {
    try {
      const parsed = JSON.parse(response);
      
      // Validar estructura
      if (!parsed.steps || !Array.isArray(parsed.steps)) {
        throw new Error('Invalid response structure');
      }

      return {
        steps: parsed.steps.map((step: { name?: string; description?: string; dayOffset?: number; priority?: string; category?: string }) => ({
          name: step.name || 'Paso de tratamiento',
          description: step.description || 'Descripción no disponible',
          dayOffset: step.dayOffset || 0,
          priority: step.priority || 'medium',
          category: step.category || 'treatment'
        })),
        generalNotes: parsed.generalNotes || 'Seguir las recomendaciones técnicas estándar.',
        estimatedDuration: parsed.estimatedDuration || 'Variable según condiciones'
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw new Error('Failed to parse AI recommendations');
    }
  }

  /**
   * Genera recomendaciones de respaldo si falla la IA
   */
  private getFallbackRecommendations(diagnosis: Diagnosis): AITreatmentRecommendation {
    const isHealthy = !diagnosis.disease_detected;
    
    if (isHealthy) {
      return {
        steps: [
          {
            name: "Monitoreo preventivo",
            description: "Realizar inspección visual semanal de las plantas para detectar tempranamente cualquier anomalía.",
            dayOffset: 0,
            priority: "medium",
            category: "monitoring"
          },
          {
            name: "Mantenimiento nutricional",
            description: "Aplicar fertilización balanceada según análisis de suelo y estado fenológico del cultivo.",
            dayOffset: 7,
            priority: "medium", 
            category: "prevention"
          }
        ],
        generalNotes: "Mantener buenas prácticas agrícolas y monitoreo constante.",
        estimatedDuration: "Actividades de rutina continuas"
      };
    }

    // Recomendaciones genéricas para enfermedades
    return {
      steps: [
        {
          name: "Tratamiento inmediato",
          description: "Aplicar fungicida o tratamiento específico según el tipo de enfermedad detectada.",
          dayOffset: 0,
          priority: "high",
          category: "treatment"
        },
        {
          name: "Seguimiento del tratamiento",
          description: "Monitorear la efectividad del tratamiento aplicado y síntomas de recuperación.",
          dayOffset: 7,
          priority: "medium",
          category: "monitoring"
        },
        {
          name: "Medidas preventivas",
          description: "Implementar prácticas para prevenir futuras infecciones o problemas similares.",
          dayOffset: 14,
          priority: "medium",
          category: "prevention"
        }
      ],
      generalNotes: "Consultar con un técnico agrícola para tratamientos específicos.",
      estimatedDuration: "2-4 semanas según severidad"
    };
  }

  /**
   * Convierte recomendaciones de IA a formato de pasos de tratamiento
   */
  formatForTreatmentSteps(recommendations: AITreatmentRecommendation): Array<{
    name: string;
    description: string;
    scheduledDate: string;
    hasReminder: boolean;
    reminderMinutesBefore: number;
  }> {
    const today = new Date();
    
    return recommendations.steps.map(step => {
      const scheduledDate = new Date(today);
      scheduledDate.setDate(today.getDate() + step.dayOffset);
      
      return {
        name: step.name,
        description: step.description,
        scheduledDate: scheduledDate.toISOString(),
        hasReminder: step.priority === 'high',
        reminderMinutesBefore: step.priority === 'high' ? 1440 : 480 // 24h o 8h antes
      };
    });
  }
}

// Instancia singleton exportada
export const aiRecommendationService = AIRecommendationService.getInstance();

// Export de funciones para compatibilidad
export const generateTreatmentRecommendations = (diagnosis: Diagnosis) =>
  aiRecommendationService.generateTreatmentRecommendations(diagnosis); 