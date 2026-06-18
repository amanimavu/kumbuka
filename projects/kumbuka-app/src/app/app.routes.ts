import { Routes } from '@angular/router';
import { SigUpPage } from '@routes/sign-up/sign-up.page';
import { AuthLayout } from './core/layout/app/auth/index.component';
import { LoginPage } from '@routes/login/login.page';
import { ForgetPasswordPage } from '@routes/forget-password/forget-password.page';
import { ResetPasswordPage } from '@routes/reset-password/reset-password.page';
import { RootLayout } from './core/layout/app/root.component';
import { DashboardPage } from '@routes/dashboard/dashboard.page';
import { SettingsPage } from '@routes/settings/settings';
import { ProfilePage } from '@routes/profile/profile';
import { LedgerPage } from '@routes/ledger/ledger.page';
import { authGuard } from './core/guards/auth.guard';
import { NotFoundPage } from '@app/routes/not-found/not-found.page';
import { NotificationsPage } from './routes/notifications/notifications.page';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'app', redirectTo: 'app/dashboard', pathMatch: 'full' },
	{
		path: 'auth',
		component: AuthLayout,
		children: [
			{ path: 'sign-up', component: SigUpPage, title: 'Sign Up' },
			{ path: 'login', component: LoginPage, title: 'Login' },
			{ path: 'forgot-password', component: ForgetPasswordPage, title: 'Forgot Password' },
			{ path: 'reset-password', component: ResetPasswordPage, title: 'Reset Password' },
		],
	},
	{
		path: 'app',
		component: RootLayout,
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{ path: 'dashboard', component: DashboardPage, title: 'Dashboard' },
			{ path: 'settings', component: SettingsPage, title: 'Settings' },
			{ path: 'profile', component: ProfilePage, title: 'Profile' },
			{ path: 'ledger', component: LedgerPage, title: 'Cash Flows' },
			{ path: 'notifications', component: NotificationsPage, title: 'Notifications' },
		],
	},
	{
		path: '**',
		component: NotFoundPage,
	},
];
