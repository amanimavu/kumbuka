import { Routes } from '@angular/router';
import { AuthLayout } from './core/layout/admin/auth/auth.component';
import { RootLayout } from './core/layout/admin/root.component';
import { LoginPage } from '@routes/login/login.page';
import { UserManagementPage } from '@routes/user-management/user-management.page';
import { AddUserPage } from '@routes/add-user/add-user.page';
import { UserDetailsPage } from '@routes/user-details/user-details.page';
import { NotFoundPage } from '@routes/not-found/not-found.page';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'auth', pathMatch: 'full' },
	{ path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'admin', redirectTo: 'admin/user-management', pathMatch: 'full' },
	{
		path: 'auth',
		component: AuthLayout,
		children: [{ path: 'login', component: LoginPage, title: 'Login' }],
	},
	{
		path: 'admin',
		component: RootLayout,
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{
				path: 'user-management',
				component: UserManagementPage,
				title: 'User Management',
			},
			{ path: 'add-user', component: AddUserPage, title: 'Add User' },
			{
				path: 'user-details/:id',
				component: UserDetailsPage,
				title: 'User Details',
			},
		],
	},
	{
		path: '**',
		component: NotFoundPage,
	},
];
