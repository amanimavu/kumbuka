import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'app', redirectTo: 'app/dashboard', pathMatch: 'full' },
	{
		path: 'auth',
		loadComponent: () =>
			import('./core/layout/app/auth/index.component').then((m) => m.AuthLayout),
		children: [
			{
				path: 'sign-up',
				loadComponent: () => import('@routes/sign-up/sign-up.page').then((m) => m.SigUpPage),
				title: 'Sign Up',
			},
			{
				path: 'login',
				loadComponent: () => import('@routes/login/login.page').then((m) => m.LoginPage),
				title: 'Login',
			},
			{
				path: 'forgot-password',
				loadComponent: () =>
					import('@routes/forget-password/forget-password.page').then((m) => m.ForgetPasswordPage),
				title: 'Forgot Password',
			},
			{
				path: 'reset-password',
				loadComponent: () =>
					import('@routes/reset-password/reset-password.page').then((m) => m.ResetPasswordPage),
				title: 'Reset Password',
			},
		],
	},
	{
		path: 'app',
		loadComponent: () => import('./core/layout/app/root.component').then((m) => m.RootLayout),
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{
				path: 'dashboard',
				loadComponent: () => import('@routes/dashboard/dashboard.page').then((m) => m.DashboardPage),
				title: 'Dashboard',
			},
			{
				path: 'settings',
				loadComponent: () => import('@routes/settings/settings').then((m) => m.SettingsPage),
				title: 'Settings',
			},
			{
				path: 'profile',
				loadComponent: () => import('@routes/profile/profile').then((m) => m.ProfilePage),
				title: 'Profile',
			},
			{
				path: 'ledger',
				loadComponent: () => import('@routes/ledger/ledger.page').then((m) => m.LedgerPage),
				title: 'Cash Flows',
			},
			{
				path: 'notifications',
				loadComponent: () =>
					import('./routes/notifications/notifications.page').then((m) => m.NotificationsPage),
				title: 'Notifications',
			},
		],
	},
	{
		path: '**',
		loadComponent: () => import('@app/routes/not-found/not-found.page').then((m) => m.NotFoundPage),
	},
];
