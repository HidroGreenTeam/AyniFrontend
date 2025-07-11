"use client";

import { useState, useEffect } from 'react';
import { Crown, Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
// import { useAuth } from '@/features/auth/hooks/useAuth';
import { PlanDetails, UserSubscription } from '@/features/subscription/types/subscription';
import {
    // getSubscriptionPlans,
    // getUserSubscription,
    // initiatePayPalPayment,
    // cancelSubscription
} from '@/features/subscription/services/subscription';

// Datos de ejemplo para mostrar la interfaz
const MOCK_PLANS: PlanDetails[] = [
    {
        id: 'free',
        name: 'Plan Gratuito',
        price: 0,
        billingPeriod: 'monthly',
        diagnosticsLimit: 10,
        features: [
            { name: 'Diagnóstico de cultivos', description: '10 diagnósticos por mes', included: true },
            { name: 'Registro de finanzas básico', description: 'Ingresos y gastos', included: true },
            { name: 'Asistente por WhatsApp', description: 'Comandos básicos', included: true },
            { name: 'Diagnósticos ilimitados', description: 'Sin límite mensual', included: false },
            { name: 'Reportes avanzados', description: 'Análisis detallado', included: false },
            { name: 'Asistente WhatsApp Premium', description: 'Todas las funciones', included: false },
        ]
    },
    {
        id: 'pro',
        name: 'Plan Pro',
        price: 29.99,
        billingPeriod: 'monthly',
        diagnosticsLimit: -1, // ilimitado
        features: [
            { name: 'Diagnóstico de cultivos', description: 'Diagnósticos ilimitados', included: true },
            { name: 'Registro de finanzas avanzado', description: 'Con reportes y análisis', included: true },
            { name: 'Asistente por WhatsApp', description: 'Funciones premium', included: true },
            { name: 'Diagnósticos ilimitados', description: 'Sin límite mensual', included: true },
            { name: 'Reportes avanzados', description: 'Análisis detallado', included: true },
            { name: 'Asistente WhatsApp Premium', description: 'Todas las funciones', included: true },
        ]
    }
];

const MOCK_SUBSCRIPTION: UserSubscription = {
    plan: 'free',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    diagnosticsUsed: 7,
    diagnosticsLimit: 10,
    autoRenew: true
};

export default function SubscriptionPage() {
    // const { user } = useAuth();
    const [plans] = useState<PlanDetails[]>(MOCK_PLANS);
    const [subscription, setSubscription] = useState<UserSubscription>(MOCK_SUBSCRIPTION);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        // En producción, cargar datos reales
        // loadSubscriptionData();
    }, []);

    const handleUpgrade = async (planId: string) => {
        try {
            setUpgrading(true);
            // En producción, usar la API real
            // const paypalUrl = await initiatePayPalPayment(user!.id, {
            //     planId,
            //     billingPeriod,
            //     paymentMethod: 'paypal'
            // });
            // window.location.href = paypalUrl;
            
            // Simulación
            alert(`En producción, esto te llevaría a PayPal para el plan ${planId}`);
        } catch {
            setError('Error al procesar el pago');
        } finally {
            setUpgrading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm('¿Estás seguro de que quieres cancelar tu suscripción?')) return;
        
        try {
            setLoading(true);
            // En producción, usar la API real
            // await cancelSubscription(user!.id);
            // await loadSubscriptionData();
            
            // Simulación
            setSubscription(prev => ({
                ...prev,
                status: 'cancelled'
            }));
        } catch {
            setError('Error al cancelar la suscripción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                    <Crown className="mr-2 h-6 w-6 text-green-600" />
                    Suscripción
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Gestiona tu plan y accede a más beneficios
                </p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                    </div>
                </div>
            )}

            {/* Estado actual de suscripción */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Tu suscripción actual
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {subscription.plan === 'free' ? 'Plan Gratuito' : 'Plan Pro'}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subscription.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                        {subscription.status === 'active' ? 'Activo' : 'Cancelado'}
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {/* Uso de diagnósticos */}
                    <div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>Diagnósticos usados</span>
                            <span>
                                {subscription.diagnosticsUsed} / {subscription.diagnosticsLimit === -1 ? '∞' : subscription.diagnosticsLimit}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                    width: subscription.diagnosticsLimit === -1
                                        ? '100%'
                                        : `${(subscription.diagnosticsUsed / subscription.diagnosticsLimit) * 100}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Período actual:</span>
                        <span className="text-gray-800 dark:text-white">
                            {new Date(subscription.startDate).toLocaleDateString()} - {new Date(subscription.endDate).toLocaleDateString()}
                        </span>
                    </div>

                    {subscription.plan === 'pro' && subscription.status === 'active' && (
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                            Cancelar suscripción
                        </button>
                    )}
                </div>
            </div>

            {/* Planes disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border-2 ${
                            plan.id === 'pro'
                                ? 'border-green-500 dark:border-green-500/50'
                                : 'border-gray-100 dark:border-gray-700'
                        }`}
                    >
                        {plan.id === 'pro' && (
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                                Recomendado
                            </span>
                        )}
                        
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {plan.name}
                        </h3>
                        
                        <div className="mt-4 flex items-baseline">
                            <span className="text-4xl font-bold text-gray-800 dark:text-white">
                                S/ {plan.price}
                            </span>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                                /mes
                            </span>
                        </div>

                        <ul className="mt-6 space-y-4">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex">
                                    {feature.included ? (
                                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                                    ) : (
                                        <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                                    )}
                                    <div>
                                        <p className={`text-sm ${
                                            feature.included
                                                ? 'text-gray-800 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {feature.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {((plan.id === 'pro' && subscription.plan === 'free') ||
                         (plan.id === 'pro' && subscription.status === 'cancelled')) && (
                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={upgrading}
                                className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                            >
                                {upgrading ? (
                                    <span className="flex items-center justify-center">
                                        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                                        Procesando...
                                    </span>
                                ) : (
                                    'Actualizar a Pro'
                                )}
                            </button>
                        )}

                        {plan.id === 'free' && subscription.plan === 'free' && (
                            <div className="w-full mt-6 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-center">
                                Plan actual
                            </div>
                        )}

                        {plan.id === 'pro' && subscription.plan === 'pro' && subscription.status === 'active' && (
                            <div className="w-full mt-6 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-center">
                                Plan actual
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 