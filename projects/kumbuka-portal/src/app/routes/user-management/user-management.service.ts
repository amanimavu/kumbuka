import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { AppUser, CreateUserPayload } from './user.types';

@Injectable({
	providedIn: 'root',
})
export class UserManagementService {
	private readonly baseUrl = `${environment.backendBaseUrl}/api/admin/users`;

	private http = inject(HttpClient);

	list() {
		return this.http.get<AppUser[]>(this.baseUrl).pipe(catchError(this.handleError));
	}

	create(payload: CreateUserPayload) {
		return this.http.post<AppUser>(this.baseUrl, payload).pipe(catchError(this.handleError));
	}

	delete(id: number) {
		return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		console.error('UserManagementService error:', error);
		return throwError(
			() =>
				new Error(error.error?.message || error.error || 'User management request failed.'),
		);
	}
}
