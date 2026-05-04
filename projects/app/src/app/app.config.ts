import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environments.development';
import { routes } from './app.routes';
import { BASE_PATH, } from 'lib';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: BASE_PATH,
      useValue: {
        apiUrl: environment.apiUrl
      }
    }
  ],
};
