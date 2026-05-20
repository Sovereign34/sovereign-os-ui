// src/junior/hooks/useAuth.js
// Phase C — Supabase Auth hook
// Değişiklik: signInWithOtp eklendi (Magic Link — şifresiz giriş)
// Kullanım: const { user, session, loading, signIn, signInWithOtp, signOut } = useAuth()

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useAuth() {
  const [user,    setUser]    = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mevcut session'ı al
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Auth state değişikliklerini dinle
    // Magic Link callback'i burası yakalar — SIGNED_IN event'i tetiklenir
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email + şifre girişi (mevcut — korundu)
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Magic Link — şifresiz giriş
  // Kullanıcı emailini girer → link gelir → linke tıklar → onAuthStateChange tetiklenir
  const signInWithOtp = async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Magic link tıklandıktan sonra buraya yönlendirilir
        // Supabase JS client URL hash'inden token'ı otomatik işler
        emailRedirectTo: `${window.location.origin}/junior/chat`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signIn, signInWithOtp, signOut };
}
