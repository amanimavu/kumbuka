import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { KumbukaPreset } from './core/theme/kumbuka-preset';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
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
