import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IJobBid } from 'app/shared/model/job-bid.model';

type EntityResponseType = HttpResponse<IJobBid>;
type EntityArrayResponseType = HttpResponse<IJobBid[]>;

@Injectable({ providedIn: 'root' })
export class JobBidService {
    private resourceUrl = SERVER_API_URL + 'api/job-bids';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/job-bids';

    constructor(private http: HttpClient) {}

    create(jobBid: IJobBid): Observable<EntityResponseType> {
        return this.http.post<IJobBid>(this.resourceUrl, jobBid, { observe: 'response' });
    }

    update(jobBid: IJobBid): Observable<EntityResponseType> {
        return this.http.put<IJobBid>(this.resourceUrl, jobBid, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IJobBid>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IJobBid[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IJobBid[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
