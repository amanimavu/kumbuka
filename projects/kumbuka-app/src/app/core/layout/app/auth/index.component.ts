import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'auth-layout',
	template: `
		<div class="bg-[#F8F9FF] min-h-screen relative py-14 overflow-clip"><router-outlet /></div>
	`,
	imports: [RouterOutlet],
})
export class AuthLayout {}
