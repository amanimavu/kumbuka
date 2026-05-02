import { Routes } from '@angular/router';
import { SigUpPage } from './routes/sign-up/sign-up.page';
import { LandingPage } from './routes/landing/landing.page';
import { AuthLayout } from './core/layout/app/auth/index.component';
import { LoginPage } from './routes/login/login.page';
import { ForgetPasswordPage } from './routes/forget-password/forget-password.page';
import { ResetPasswordPage } from './routes/reset-password/reset-password.page';

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
];
