import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IJobLocation } from 'app/shared/model/job-location.model';

type EntityResponseType = HttpResponse<IJobLocation>;
type EntityArrayResponseType = HttpResponse<IJobLocation[]>;

@Injectable({ providedIn: 'root' })
export class JobLocationService {
    private resourceUrl = SERVER_API_URL + 'api/job-locations';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/job-locations';

    constructor(private http: HttpClient) {}

    create(jobLocation: IJobLocation): Observable<EntityResponseType> {
        return this.http.post<IJobLocation>(this.resourceUrl, jobLocation, { observe: 'response' });
    }

    update(jobLocation: IJobLocation): Observable<EntityResponseType> {
        return this.http.put<IJobLocation>(this.resourceUrl, jobLocation, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IJobLocation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IJobLocation[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IJobLocation[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
