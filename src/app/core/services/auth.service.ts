import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap, catchError, throwError, shareReplay, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
	accessToken: string;
	message?: string;
}

export interface LoginCredentials {
	email: string;
	password?: string;
	otp?: string;
}

export interface RegistrationPayload {
	name: string;
	email: string;
	phoneNumber: string;
	password: string;
}

export interface EmailVerificationPayload {
	email: string;
	otp: number;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	// private baseUrl = environment.backendBaseUrl;
	private baseUrl = 'https://dummyjson.com/auth';
	http = inject(HttpClient);
	private platformId = inject(PLATFORM_ID);

	login(credentials: LoginCredentials): Observable<Required<AuthResponse>> {
		return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
			map((data) => ({
				accessToken: data.accessToken,
				message: data.message ?? 'Login successful',
			})),
			catchError(this.handleError),
		);
	}

	register(payload: RegistrationPayload): Observable<string> {
		return this.http
			.post(`${this.baseUrl}/register`, payload, { responseType: 'text' })
			.pipe(catchError(this.handleError));
	}

	verifyEmail(credentials: LoginCredentials): Observable<string> {
		return this.http
			.post<string>(`${this.baseUrl}/register`, credentials)
			.pipe(catchError(this.handleError));
	}

	storeToken(token: string): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem('token', token);
		}
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('token');
		}
	}
	getToken(): string | null {
		if (isPlatformBrowser(this.platformId)) {
			return localStorage.getItem('token');
		}
		return null;
	}
	isAuthenticated(): boolean {
		return !!this.getToken();
	}

	private handleError(error: HttpErrorResponse) {
		if (error.status === 0) {
			// A client-side or network error occurred (e.g., timeout, network drop).
			console.error('A client-side or network error occurred:', error.error);
		} else {
			// The backend returned an unsuccessful response code.
			console.error(`Backend returned code ${error.status}, body was: `, error.error);
		}

		return throwError(
			() => new Error(error.error?.message || 'Authentication failed. Please try again.'),
		);
	}
}
