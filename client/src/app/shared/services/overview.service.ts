import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoursCurrency} from '../interfaces';

@Injectable({
    providedIn: 'root'
})

export class OverviewService {

    constructor(private http: HttpClient) {

    }

    getCurrency(): Observable<any> {
        const url = 'http://apilayer.net/api/live?access_key=5aeebd574d7933d512d6f97b2e394b22&currencies=EUR,RUB&format=1&callback=CALLBACK_FUNCTION'
        return this.http.jsonp<any>(url, 'callback')
            .pipe(
                map((response: Response) => response)
            )
    }

    getByDate(date): Observable<any> {
        return this.http.get<any>(`/api/currency_date/date/${date}`)
    }

    addCurrency(cours: CoursCurrency): Observable<any> {
        return this.http.post<any>('/api/currency_date/', cours)
    }

}
