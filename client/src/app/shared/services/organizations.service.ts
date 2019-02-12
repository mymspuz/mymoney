import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Organization, OrganizationMonthSumm, OrganizationSumm} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class OrganizationsService {

    constructor(private http: HttpClient) {

    }

    fetch(): Observable<Organization[]> {
        return this.http.get<Organization[]>('/api/organization');
    }

    getById(id: string): Observable<Organization> {
        return this.http.get<Organization>(`/api/organization/${id}`)
    }

    create(name: string, image?: File): Observable<Organization> {
        const fd = new FormData()
        if (image) {
            fd.append('image', image, image.name)
        }
        fd.append('name', name)
        return this.http.post<Organization>('/api/organization', fd)
    }

    update(id: string, name: string, myimage?: File): Observable<Organization> {
        const fd = new FormData()
        if (myimage) {
            fd.append('image', myimage, myimage.name)
        }
        fd.append('name', name)
        return this.http.patch<Organization>(`/api/organization/${id}`, fd)
    }

    delete(id: string): Observable<string> {
        return this.http.delete<string>(`/api/organization/${id}`)
    }

    getAllOrganizationSumm(): Observable<OrganizationSumm[]> {
        return this.http.get<OrganizationSumm[]>('/api/organization/summ')
    }

    getLastNumberMonth(): Observable<OrganizationMonthSumm[]> {
        return this.http.get<OrganizationMonthSumm[]>('/api/organization/month')
    }

}
