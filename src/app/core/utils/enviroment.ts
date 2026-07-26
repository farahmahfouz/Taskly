import { InjectionToken } from '@angular/core';

export interface Environment {
  apiUrl: string;
  supabaseAnonKey: string;
}

export const environment: Environment = {
  apiUrl: 'https://fxauwbhgcedymmgoscxv.supabase.co',
  supabaseAnonKey: 'sb_publishable_54tl36MeXBqke41iY28O0A_qLbnyo-C',
};

export const ENVIRONMENT = new InjectionToken<Environment>('app.environment', {
  providedIn: 'root',
  factory: () => environment,
});
