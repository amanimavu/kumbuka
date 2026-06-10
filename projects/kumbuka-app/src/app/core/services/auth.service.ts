import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, throwError, map } from 'rxjs';
import { environment } from '@env/environment';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

type SelectionArg = keyof (LoginResponse & RegistrationResponse);

export type LoginResponse = {
	userId: number;
	email: string;
	name: string;
	message: string;
	token: string;
	refreshToken: string;
};

export type LoginCredentials = {
	email: string;
	password?: string;
	otp?: string;
};

export type RegistrationRequestPayload = {
	fullName: string;
	email: string;
	phoneNumber: string;
	password: string;
	confirmPassword: string;
};

export type RegistrationResponse = {
	userId: number;
	email: string;
	name: string;
	message: string;
	token: string;
	refreshToken: string;
};

export interface EmailVerificationPayload {
	email: string;
	otp: number;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly baseUrl = `${environment.backendBaseUrl}/api/auth`;

	http = inject(HttpClient);
	localstorage = inject(LocalstorageService);
	private platformId = inject(PLATFORM_ID);

	login(credentials: LoginCredentials) {
		return this.http.post<LoginResponse>(`${this.baseUrl}/login`, credentials).pipe(
			map((data) => ({
				...data,
				token: data.token,
				message: data.message ?? 'Login successful',
			})),
			catchError(this.handleError),
		);
	}

	register(payload: RegistrationRequestPayload) {
		return this.http.post<RegistrationResponse>(`${this.baseUrl}/register`, payload).pipe(
			map((data) => ({
				email: data.email,
				token: data.token,
				refreshToken: data.refreshToken,
				// tokenExpiration: data.tokenExpiration,
				message: data.message,
			})),
			catchError(this.handleError),
		);
	}

	// verifyEmail(credentials: LoginCredentials): Observable<string> {
	// 	return this.http
	// 		.post(`${this.baseUrl}/register`, credentials)
	// 		.pipe(catchError(this.handleError));
	// }

	storeResponseData(
		res: Partial<LoginResponse | RegistrationResponse>,
		selection: SelectionArg[],
	): void {
		if (isPlatformBrowser(this.platformId)) {
			selection.forEach((item) => {
				this.localstorage.set(item, res[item]);
			});
		}
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			this.localstorage.clear();
		}
	}
	getToken(): string | null {
		if (isPlatformBrowser(this.platformId)) {
			return this.localstorage.get('token');
		}
		return null;
	}
	isAuthenticated(): boolean {
		return !!this.getToken();
	}

	private handleError(error: HttpErrorResponse) {
		console.log('Raw Error body: ', error);
		if (error.status === 0) {
			// A client-side or network error occurred (e.g., timeout, network drop).
			console.error('A client-side or network error occurred:', error.error);
		} else {
			// The backend returned an unsuccessful response code.
			console.error(`Backend returned code ${error.status}, body was: `, error.error);
		}

		return throwError(
			() =>
				new Error(
					error.error?.message ||
						error.error ||
						'Authentication failed. Please try again.',
				),
		);
	}
}
