import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const session = await supabase.getSession();
  
  if (!session) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};

export const loginGuard = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  const session = await supabase.getSession();
  
  if (session) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};