"use client";

import AuthLayout from "@/features/auth/components/AuthLayout";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Únete a Ayni y mejora tus cultivos con tecnología"
      linkText="¿Ya tienes una cuenta? Inicia sesión"
      linkHref="/login"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
