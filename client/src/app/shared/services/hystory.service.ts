import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Income} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class HystoryService {

    constructor(private http: HttpClient) {

    }

    fetch(params: any = {}): Observable<Income[]> {
        return this.http.get<Income[]>('/api/income', {
            params: new HttpParams({
                fromObject: params
            })
        })
    }
}