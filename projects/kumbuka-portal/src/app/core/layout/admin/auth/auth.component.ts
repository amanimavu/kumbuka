import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'auth-layout',
	template: `
		<p-toast position="top-center" />
		<div class="bg-[#F8F9FF] min-h-screen relative py-14 overflow-clip"><router-outlet /></div>
	`,
	imports: [RouterOutlet, ToastModule],
	providers: [MessageService],
})
export class AuthLayout {}
