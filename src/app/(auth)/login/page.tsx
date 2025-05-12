"use client";

import AuthLayout from "@/features/auth/components/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresa a tu cuenta para administrar tus cultivos"
      linkText="¿No tienes una cuenta? Regístrate"
      linkHref="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
