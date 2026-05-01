import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { KumbukaPreset } from './core/theme/kumbuka-preset';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideClientHydration(withEventReplay()),
		providePrimeNG({
			theme: {
				preset: KumbukaPreset,
				options: {
					darkModeSelector: 'none', // Disables dark mode completely
				},
			},
		}),
	],
};
