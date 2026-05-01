import { Routes } from '@angular/router';
import { SigUpPage } from './routes/sign-up/index.page';
import { LandingPage } from './routes/landing/index.page';
import { AuthLayout } from './core/layout/app/auth/index.component';

export const routes: Routes = [
	{ path: '', component: LandingPage },
	{
		path: 'auth',
		component: AuthLayout,
		children: [{ path: 'sign-up', component: SigUpPage }],
	},
];
