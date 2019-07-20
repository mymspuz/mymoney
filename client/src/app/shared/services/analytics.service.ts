import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CoursCurrency, OrganizationMonthSumm, OrganizationYearSumm} from '../interfaces';

@Injectable({
    providedIn: 'root'
})

export class AnalyticsService {

    constructor(private http: HttpClient) {
    }

    getAllYear(): Observable<OrganizationYearSumm[]> {
        return this.http.get<OrganizationYearSumm[]>('/api/analytics/years')
    }

    getAllMonth(): Observable<OrganizationMonthSumm[]> {
        return this.http.get<OrganizationMonthSumm[]>('/api/analytics/months')
    }

    getAllCurr(): Observable<CoursCurrency[]> {
        return this.http.get<CoursCurrency[]>('/api/analytics/coursecurrency')
    }

}
