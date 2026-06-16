import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, map, throwError } from 'rxjs';

export type DebtStatus = 'PAID' | 'PARTIALLY_PAID' | 'ACTIVE';

export type LoanPayment = {
	amount: number;
	paymentDate: string;
};

export type LoanBorrowedResponse = {
	id: number;
	loanAmount: number;
	amountPaid: number;
	balance: number;
	personName: string;
	phoneNumber: string;
	dateBorrowed: string; //'2026-06-22T00:00:00Z'
	dueDate: string;
	status: DebtStatus;
	installments: [];
};

export type LoanBorrowed = {
	id: number;
	lender: string;
	phoneNumber: string;
	amount: {
		borrowed: number;
		paid: number;
		balance: number;
	};
	payments: [];
	dueDate: string;
	dateBorrowed: string;
	status: DebtStatus;
};

export type RecordBorrowedLoanPayload = {
	personName: string;
	phoneNumber: string;
	amountBorrowed: number;
	dateBorrowed: string;
	dueDate: string;
	notes: string;
};

@Injectable({
	providedIn: 'root',
})
export class LoansBorrowedService {
	private readonly baseUrl = `${environment.backendBaseUrl}/api`;
	http = inject(HttpClient);

	getLoansBorrowed() {
		return this.http.get<LoanBorrowedResponse[]>(`${this.baseUrl}/loans-borrowed`).pipe(
			map((data) =>
				data.map(
					(item): LoanBorrowed => ({
						id: item.id,
						lender: item.personName,
						phoneNumber: item.phoneNumber,
						amount: {
							borrowed: item.loanAmount,
							paid: item.amountPaid,
							balance: item.balance,
						},
						dueDate: item.dueDate,
						dateBorrowed: item.dateBorrowed,
						status: item.status,
						payments: item.installments,
					}),
				),
			),
			catchError(this.handleError),
		);
	}

	getLoanBorrowedById(id: string | number) {
		return this.http
			.get<LoanBorrowedResponse>(`${this.baseUrl}/loans-borrowed/${id}`)
			.pipe(catchError(this.handleError));
	}

	recordLoan(payload: RecordBorrowedLoanPayload) {
		return this.http
			.post<LoanBorrowedResponse>(`${this.baseUrl}/loans-borrowed`, payload)
			.pipe(catchError(this.handleError));
	}

	updateLoanBorrowed(id: string | number, payload: RecordBorrowedLoanPayload) {
		return this.http
			.put<LoanBorrowedResponse>(`${this.baseUrl}/loans-borrowed/${id}`, payload)
			.pipe(catchError(this.handleError));
	}

	deleteLoanBorrowed(id: string | number) {
		return this.http
			.delete<void>(`${this.baseUrl}/loans-borrowed/${id}`)
			.pipe(catchError(this.handleError));
	}

	recordPayment(id: string | number, amount: number) {
		return this.http
			.post<LoanBorrowedResponse>(`${this.baseUrl}/loans-borrowed/${id}/payment`, { amount })
			.pipe(catchError(this.handleError));
	}

	private handleError(error: HttpErrorResponse) {
		console.log('Raw Error body: ', error);
		if (error.status === 0) {
			console.error('A client-side or network error occurred:', error.error);
		} else {
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
