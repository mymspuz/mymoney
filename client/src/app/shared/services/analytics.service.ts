import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoursCurrency, OrganizationMonthSumm, OrganizationYearSumm, TypeCash} from '../interfaces';

@Injectable({
    providedIn: 'root'
})

export class AnalyticsService {

    constructor(private http: HttpClient) {}

    getAllYear(organizationId?: string): Observable<OrganizationYearSumm[]> {
        let qp = ''
        if (organizationId) {
          qp = '?oid=' + organizationId
        }
        return this.http.get<OrganizationYearSumm[]>(`/api/analytics/years${qp}`)
    }

    getAllMonth(organizationId?: string): Observable<OrganizationMonthSumm[]> {
        let qp = ''
        if (organizationId) {
          qp = '?oid=' + organizationId
        }
        return this.http.get<OrganizationMonthSumm[]>(`/api/analytics/months${qp}`)
    }

    getAllCurr(): Observable<CoursCurrency[]> {
        return this.http.get<CoursCurrency[]>('/api/analytics/coursecurrency')
    }

    getTypeCash(): Observable<TypeCash[]> {
        return this.http.get<TypeCash[]>('/api/analytics/typecash')
    }
}
