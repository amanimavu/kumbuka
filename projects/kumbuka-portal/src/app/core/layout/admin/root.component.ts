import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavBar } from './sidenav.component';
import { Header } from './header.component';
import { ToastModule } from 'primeng/toast';

@Component({
	template: `
		<p-toast position="top-center" />
		<div class="relative h-screen overflow-hidden bg-[#F8F9FF]">
			<sidebar></sidebar>
			<header></header>
			<main class="pl-28 pt-16 h-full">
				<div class="pr-8 pt-8 pb-20 h-full overflow-y-auto scrollbar-thin relative">
					<router-outlet />
				</div>
			</main>
		</div>
	`,
	imports: [RouterOutlet, Header, SideNavBar, ToastModule],
})
export class RootLayout {}
