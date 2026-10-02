import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OverviewService {

    constructor(private http: HttpClient) {

    }

    getByDate(date): Observable<any> {
        return this.http.get<any>(`/api/currency_date/date/${date}`)
    }

}
