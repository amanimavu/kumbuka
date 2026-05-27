import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap, catchError, throwError, shareReplay, map } from 'rxjs';
import { environment } from '@env/environment';
import { LocalstorageService } from '@app/shared/services/localstorage.service';

export type AuthResponse = {
	id: number;
	userId: number;
	email: string;
	token: string;
	refreshToken: string;
	isVerified: boolean;
	message: string;
};

export type LoginCredentials = {
	email: string;
	password?: string;
	otp?: string;
};

export type RegistrationPayload = {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
	confirmPassword: string;
	role: 'BORROWER' | 'LENDER';
};

export interface EmailVerificationPayload {
	email: string;
	otp: number;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly baseUrl = `${environment.backendBaseUrl}/kumbukaa/api/auth`;

	http = inject(HttpClient);
	localstorage = inject(LocalstorageService);
	private platformId = inject(PLATFORM_ID);

	login(credentials: LoginCredentials): Observable<Pick<AuthResponse, 'token' | 'message'>> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
			map((data) => ({
				token: data.token,
				message: data.message ?? 'Login successful',
			})),
			catchError(this.handleError),
		);
	}

	register(payload: RegistrationPayload): Observable<string> {
		return this.http
			.post(`${this.baseUrl}/register`, payload, {
				responseType: 'text',
				headers: { Accept: 'text/plain' },
			})
			.pipe(catchError(this.handleError));
	}

	// verifyEmail(credentials: LoginCredentials): Observable<string> {
	// 	return this.http
	// 		.post(`${this.baseUrl}/register`, credentials)
	// 		.pipe(catchError(this.handleError));
	// }

	storeToken(token: string): void {
		if (isPlatformBrowser(this.platformId)) {
			this.localstorage.set('token', token);
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
