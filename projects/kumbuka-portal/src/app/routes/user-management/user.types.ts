export type AppUser = {
	id: number;
	fullName: string;
	email: string;
	phoneNumber: string;
	loansLent: number;
	loansBorrowed: number;
};

export interface CreateUserPayload {
	fullName: string;
	email: string;
	phoneNumber: string;
	password: string;
}

export interface Installment {
	amount: number;
	paymentDate: string;
}

export interface Loan {
	id: number;
	loanAmount: number;
	amountPaid: number;
	balance: number;
	personName: string;
	phoneNumber: string;
	dateLent?: string;
	dateBorrowed?: string;
	dueDate: string;
	paymentDate?: string;
	status: string;
	notes?: string;
	installments: Installment[];
}

export interface UserDetails extends Omit<AppUser, 'loansLent' | 'loansBorrowed'> {
	loansLent: Loan[];
	loansBorrowed: Loan[];
}
