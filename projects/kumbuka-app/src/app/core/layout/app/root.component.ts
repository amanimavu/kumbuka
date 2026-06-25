import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavBar } from './sidenav.component';
import { Header } from './header.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
@Component({
	template: ` <p-toast position="top-center" />
		<p-confirmpopup />
		<div class="relative h-screen overflow-hidden bg-[#F8F9FF]">
			<sidebar></sidebar>
			<header></header>
			<main class="pt-16 pb-16 md:pb-0 md:pl-28 h-full">
				<div
					class="px-4 md:px-0 md:pr-8 pt-8 pb-20 h-full overflow-y-auto scrollbar-thin relative"
				>
					<router-outlet />
				</div>
			</main>
		</div>`,
	imports: [RouterOutlet, Header, SideNavBar, ToastModule, ConfirmPopupModule],
	providers: [ConfirmationService, MessageService],
})
export class RootLayout {}
