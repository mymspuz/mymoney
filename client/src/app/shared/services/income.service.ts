import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Income} from '../interfaces';

@Injectable({
    providedIn: 'root'
})

export class IncomeService {
    constructor(private http: HttpClient) {

    }

    fetch(organizationId): Observable<Income[]> {
        return this.http.get<Income[]>(`/api/income/${organizationId}`)
    }

    create(income: Income) {
        return this.http.post<Income>('/api/income/', income)
    }

    update(income: Income) {
        return this.http.patch<Income>(`/api/income/${income.id}`, income)
    }

    delete(income: Income): Observable<string> {
        return this.http.delete<string>(`/api/income/${income.id}`)
    }

    getById(id): Observable<Income> {
        return this.http.get<Income>(`/api/income/income/${id}`)
    }

}