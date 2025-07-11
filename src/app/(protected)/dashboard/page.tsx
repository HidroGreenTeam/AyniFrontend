"use client";

import { 
  Activity, 
  AlertCircle, 
  Coffee, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Eye,
  Plus,
  ArrowRight,
  Target,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCrops } from "@/features/crops/hooks/useCrops";
import { useDiagnosisStats } from "@/features/diagnosis/hooks/useDiagnosisStats";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();
  const { crops } = useCrops(user as { id: number; [key: string]: unknown } | null);
  const { stats: diagnosisStats, isLoading: statsLoading } = useDiagnosisStats();
  const [loading, setLoading] = useState(false);

  // Datos mock del dashboard - en el futuro esto vendría de un hook específico
  const [dashboard] = useState<{
    recentCrops: unknown[];
    activeAlerts: unknown[];
    upcomingTreatments: unknown[];
    recentActivity: unknown[];
    dailyTip: {
      title: string;
      content: string;
    };
  }>({
    recentCrops: [],
    activeAlerts: [],
    upcomingTreatments: [],
    recentActivity: [],
    dailyTip: {
      title: "Consejo del día",
      content: "Mantén un registro regular de la humedad del suelo para optimizar el riego de tus cultivos."
    }
  });

  useEffect(() => {
    async function fetchDashboard() {
      if (user?.id) {
        setLoading(true);
        // Aquí deberías hacer el fetch real de dashboard
        // Por ahora, solo simula que se setea el dashboard con datos mock
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [user?.id]);

  // Estadísticas usando datos reales y global store
  const cropStats = { total: crops.length, active: crops.length };
  const treatmentStats = { active: diagnosisStats.requiresTreatment };
  const alertStats = { total: diagnosisStats.diseaseDetected };

  const stats = [
    {
      name: "Cultivos activos",
      value: cropStats.total.toString(),
      icon: <Coffee className="h-6 w-6 text-green-600" />,
      link: "/crops",
      color: "green"
    },
    {
      name: "Diagnósticos este mes",
      value: diagnosisStats.thisMonth.toString(),
      icon: <Activity className="h-6 w-6 text-blue-600" />,
      link: "/diagnosis",
      color: "blue"
    },
    {
      name: "Tratamientos requeridos",
      value: treatmentStats.active.toString(),
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      link: "/treatments",
      color: "purple"
    },
    {
      name: "Enfermedades detectadas",
      value: alertStats.total.toString(),
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
      link: "/history",
      color: "yellow"
    },
  ];

  // Estadísticas adicionales para mostrar más detalle
  const additionalStats = [
    {
      name: "Total diagnósticos",
      value: diagnosisStats.total,
      icon: <Target className="h-5 w-5 text-indigo-600" />,
      color: "indigo"
    },
    {
      name: "Cultivos saludables",
      value: diagnosisStats.healthyCrops,
      icon: <Shield className="h-5 w-5 text-green-600" />,
      color: "green"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Encabezado de página */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <Coffee className="mr-2 h-6 w-6 text-green-600" />
          Dashboard Cafetalero
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Bienvenido de nuevo. Aquí tienes un resumen de tus cultivos de café y actividades recientes.
        </p>
      </div>

      {/* Tarjetas de estadísticas principales */}
      {loading || statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              href={stat.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                    {stat.icon}
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Estadísticas adicionales */}
      {!statsLoading && diagnosisStats.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Resumen de diagnósticos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalStats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/20 mb-2`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.name}
                </div>
              </div>
            ))}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {diagnosisStats.thisWeek}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Esta semana
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {diagnosisStats.requiresTreatment}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Requieren tratamiento
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cultivos recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Cultivos recientes
            </h2>
            <Link href="/crops" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
              Ver todas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {crops.length === 0 ? (
                <div className="text-center py-8">
                  <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No tienes cultivos registrados</p>
                  <Link href="/crops" className="mt-2 text-sm text-green-600 dark:text-green-400 hover:text-green-700 flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar primer cultivo
                  </Link>
                </div>
              ) : (
                crops.slice(0, 3).map((crop) => (
                  <div key={crop.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center overflow-hidden">
                      {crop.imageUrl ? (
                        <Image 
                          src={crop.imageUrl} 
                          alt={crop.cropName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Coffee className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800 dark:text-white">{crop.cropName}</h3>
                        <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                          Activo
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Área: {crop.area} ha • Plantado: {new Date(crop.plantingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/crops`} className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Alertas activas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white">
              Alertas activas
            </h2>
            <Link href="/notifications" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
              Ver todas
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex items-start space-x-4">
                  <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {diagnosisStats.diseaseDetected === 0 ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay enfermedades detectadas</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {diagnosisStats.diseaseDetected} diagnóstico{diagnosisStats.diseaseDetected !== 1 ? 's' : ''} con enfermedad detectada
                  </p>
                  <Link href="/history" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium mt-1 inline-block">
                    Ver detalles →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tratamientos próximos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Tratamientos próximos
          </h2>
          <Link href="/treatments" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
            Ver todos
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dashboard.upcomingTreatments.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay tratamientos programados</p>
              </div>
            ) : (
              // dashboard.upcomingTreatments.map((treatment) => {
              //   const daysUntil = Math.ceil((new Date(treatment.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              //   const isUrgent = daysUntil <= 3;
              //   
              //   return (
              //     <div key={treatment.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              //       <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
              //         isUrgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
              //       }`}>
              //         <Clock className={`h-6 w-6 ${
              //           isUrgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
              //         }`} />
              //       </div>
              //       <div className="flex-1">
              //         <div className="flex items-center justify-between">
              //           <h3 className="font-medium text-gray-800 dark:text-white">{treatment.treatment}</h3>
              //           <span className={`text-xs px-2 py-1 rounded-full ${
              //             isUrgent 
              //               ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
              //               : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              //           }`}>
              //             {isUrgent ? 'Urgente' : treatment.priority}
              //           </span>
              //         </div>
              //         <p className="text-sm text-gray-600 dark:text-gray-400">
              //           {treatment.cropName} • Vence en {daysUntil} días
              //         </p>
              //       </div>
              //       <Link href="/treatments" className="text-gray-400 hover:text-gray-600">
              //         <Eye className="h-5 w-5" />
              //       </Link>
              //     </div>
              //   );
              // })
              []
            )}
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            Actividad reciente
          </h2>
          <Link href="/history" className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center">
            Ver todo
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dashboard.recentActivity.length === 0 ? (
              <div className="text-center py-4">
                <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay actividad reciente</p>
              </div>
            ) : (
              // dashboard.recentActivity.map((activity) => (
              //   <div key={activity.id} className="flex items-start">
              //     <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
              //       <span className="text-lg">{activity.icon}</span>
              //     </div>
              //     <div className="flex-1">
              //   <p className="text-sm text-gray-800 dark:text-white">
              //         {activity.title}
              //   </p>
              //       <p className="text-xs text-gray-500 dark:text-gray-400">
              //         {activity.description}
              //       </p>
              //       <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              //         {new Date(activity.timestamp).toLocaleString()}
              //       </p>
              //     </div>
              //   </div>
              // ))
              []
            )}
          </div>
        )}
      </div>

      {/* Consejos del día */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-100 dark:border-green-800/30">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center mr-4">
            <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white">
              {dashboard.dailyTip.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {dashboard.dailyTip.content}
            </p>
            <Link href="/library" className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 inline-flex items-center">
              Ver más consejos
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}