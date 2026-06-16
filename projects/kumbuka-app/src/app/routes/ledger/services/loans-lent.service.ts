import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, map, throwError } from 'rxjs';

export type LoanPayment = {
	amount: number;
	paymentDate: string;
};

type LoanLentResponse = {
	id: number;
	loanAmount: number;
	amountPaid: number;
	balance: number;
	personName: string;
	phoneNumber: string;
	dueDate: null | string;
	dateLent: string; // "2026-06-01T00:00:00Z"
	paymentDate: string | null;
	status: LoanLentStatus;
	notes: string;
	installments: LoanPayment[];
};
export type LoanLentStatus = 'ACTIVE' | 'PARTIALLY_PAID';
export type LoanLent = {
	id: number;
	borrower: string;
	phoneNumber: string;
	amount: { lent: number; paid: number; balance: number };
	dueDate: string | null;
	dateLent: string;
	status: LoanLentStatus;
	notes: string;
	payments: LoanPayment[];
};

type RecordLoanPayload = {
	personName: string;
	phoneNumber: string;
	amountLent: number;
	dateLent: string;
	dueDate: string; // 2026-06-03
	notes: string;
};

type RecordLoanResponse = {
	id: number;
	personName: string;
	phoneNumber: string;
	amountLent: number;
	amountPaid: number;
	balance: number;
	dateLent: string;
	dueDate: string;
	status: string;
	notes: string;
	createdAt: string;
	updatedAt: string;
};

@Injectable({
	providedIn: 'root',
})
export class LoansLentService {
	private readonly baseUrl = `${environment.backendBaseUrl}/api`;
	http = inject(HttpClient);

	getLoansLent() {
		return this.http.get<LoanLentResponse[]>(`${this.baseUrl}/loans-lent`).pipe(
			map((data) =>
				data.map(
					(item): LoanLent => ({
						id: item.id,
						borrower: item.personName,
						phoneNumber: item.phoneNumber,
						amount: {
							lent: item.loanAmount,
							paid: item.amountPaid,
							balance: item.balance,
						},
						dueDate: item.dueDate,
						dateLent: item.dateLent,
						status: item.status,
						notes: item.notes,
						payments: item.installments,
					}),
				),
			),
			catchError(this.handleError),
		);
	}

	getLoanLentById(id: string | number) {
		return this.http
			.get<LoanLentResponse>(`${this.baseUrl}/loans-lent/${id}`)
			.pipe(catchError(this.handleError));
	}

	recordLoan(payload: RecordLoanPayload) {
		return this.http
			.post<RecordLoanResponse>(`${this.baseUrl}/loans-lent`, payload)
			.pipe(catchError(this.handleError));
	}

	updateLoanLent(id: string | number, payload: RecordLoanPayload) {
		return this.http
			.put<LoanLentResponse>(`${this.baseUrl}/loans-lent/${id}`, payload)
			.pipe(catchError(this.handleError));
	}

	deleteLoanLent(id: string | number) {
		return this.http
			.delete<void>(`${this.baseUrl}/loans-lent/${id}`)
			.pipe(catchError(this.handleError));
	}

	recordPayment(id: string | number, amount: number) {
		return this.http
			.post<LoanLentResponse>(`${this.baseUrl}/loans-lent/${id}/payment`, { amount })
			.pipe(catchError(this.handleError));
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
					error.error?.message || error.error || 'Request failed. Please try again.',
				),
		);
	}
}
