import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { throwError } from 'rxjs';

export type GetDashboardSummaryResponse = {
	totalLent: number;
	totalBorrowed: number;
	amountOwedToMe: number;
	amountIOwe: number;
	activeLoansLent: number;
	activeLoansBorrowed: number;
	overdueLoans: number;
};

@Injectable({
	providedIn: 'root',
})
export class DashboardService {
	http = inject(HttpClient);
	private static baseUrl = `${environment.backendBaseUrl}/api`;

	getDashboardSummary() {
		return this.http.get<GetDashboardSummaryResponse>(
			`${DashboardService.baseUrl}/dashboard/summary`,
		);
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
					error.error?.message || error.error || 'Failed to fetch dashboard analytics',
				),
		);
	}
}
