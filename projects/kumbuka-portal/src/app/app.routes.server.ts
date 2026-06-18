import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'admin/user-management',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/user-details/:id',
		renderMode: RenderMode.Client,
	},
	{
		path: 'admin/add-user',
		renderMode: RenderMode.Client,
	},
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
