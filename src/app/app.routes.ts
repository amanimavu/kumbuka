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
import { ProfilePage } from './routes/profile/profile';
import { LedgerPage } from './routes/ledger/ledger';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: 'auth', redirectTo: 'auth/login' },
	{ path: 'app', redirectTo: 'app/dashboard' },
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
		canActivate: [authGuard],
		children: [
			{ path: 'dashboard', component: DashboardPage, title: 'Dashboard' },
			{ path: 'settings', component: SettingsPage, title: 'Settings' },
			{ path: 'profile', component: ProfilePage, title: 'Profile' },
			{ path: 'ledger', component: LedgerPage, title: 'Ledger' },
		],
	},
];
