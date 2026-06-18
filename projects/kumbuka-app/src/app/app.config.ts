import { routes } from './app.routes';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { KumbukaPreset } from './core/theme/kumbuka-preset';
import { authInterceptor } from '@shared/interceptor/auth-interceptor';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { KumbukaTitleStrategyService } from '@core/services/kumbuka-title-strategy.service';

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
		MessageService,
		provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
		{ provide: TitleStrategy, useClass: KumbukaTitleStrategyService },
	],
};
