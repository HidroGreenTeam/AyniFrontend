export type SubscriptionPlan = 'free' | 'pro';

export interface SubscriptionFeature {
    name: string;
    description: string;
    included: boolean;
}

export interface PlanDetails {
    id: string;
    name: string;
    price: number;
    billingPeriod: 'monthly' | 'yearly';
    features: SubscriptionFeature[];
    diagnosticsLimit: number;
}

export interface UserSubscription {
    plan: SubscriptionPlan;
    status: 'active' | 'cancelled' | 'expired';
    startDate: string;
    endDate: string;
    diagnosticsUsed: number;
    diagnosticsLimit: number;
    autoRenew: boolean;
}

export interface PaymentDetails {
    planId: string;
    billingPeriod: 'monthly' | 'yearly';
    paymentMethod: 'paypal';
} 