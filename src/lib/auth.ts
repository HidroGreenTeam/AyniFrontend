import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const AUTH_TOKEN_KEY = 'auth_token';

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
  
  if (!token) {
    return null;
  }

  return { token };
}

export async function login(token: string) {
  'use server';
  
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  });
}

export async function logout() {
  'use server';
  
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_KEY);
  redirect('/login');
} 