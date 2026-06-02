import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{
		path: 'app/dashboard',
		renderMode: RenderMode.Client,
	},
	{
		path: 'app/settings',
		renderMode: RenderMode.Client,
	},
	{
		path: 'app/profile',
		renderMode: RenderMode.Client,
	},
	{
		path: 'app/ledger',
		renderMode: RenderMode.Client,
	},
	// {
	// 	path: 'app/**',
	// 	renderMode: RenderMode.Client,
	// },
	{
		path: '**',
		renderMode: RenderMode.Prerender,
	},
];
