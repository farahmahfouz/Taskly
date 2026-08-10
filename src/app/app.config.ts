import { ApplicationConfig } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AppTitleStrategy } from './shared/classes/app-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
    ),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideHttpClient(withInterceptors([apiInterceptor, errorInterceptor])),
  ],
};
