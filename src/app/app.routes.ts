import { Routes } from '@angular/router';
import { SigUpPage } from './routes/sign-up/sign-up.page';
import { LandingPage } from './routes/landing/landing.page';
import { AuthLayout } from './core/layout/app/auth/index.component';
import { LoginPage } from './routes/login/login.page';
import { ForgetPasswordPage } from './routes/forget-password/forget-password.page';
import { ResetPasswordPage } from './routes/reset-password/reset-password.page';
import { RootLayout } from './core/layout/app/root.component';
import { DashboardPage } from './routes/dashboard/dashboard.page';
import { SettingsPage } from './routes/settings/settings';

export const routes: Routes = [
	{ path: '', component: LandingPage },
	{
		path: 'auth',
		component: AuthLayout,
		children: [
			{ path: 'sign-up', component: SigUpPage },
			{ path: 'login', component: LoginPage },
			{ path: 'forgot-password', component: ForgetPasswordPage },
			{ path: 'reset-password', component: ResetPasswordPage },
		],
	},
	{
		path: 'app',
		component: RootLayout,
		children: [
			{ path: 'dashboard', component: DashboardPage, title: 'Dashboard' },
			{ path: 'settings', component: SettingsPage, title: 'Settings' },
		],
	},
];
