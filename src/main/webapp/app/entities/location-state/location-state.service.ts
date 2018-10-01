import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILocationState } from 'app/shared/model/location-state.model';

type EntityResponseType = HttpResponse<ILocationState>;
type EntityArrayResponseType = HttpResponse<ILocationState[]>;

@Injectable({ providedIn: 'root' })
export class LocationStateService {
    private resourceUrl = SERVER_API_URL + 'api/location-states';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/location-states';

    constructor(private http: HttpClient) {}

    create(locationState: ILocationState): Observable<EntityResponseType> {
        return this.http.post<ILocationState>(this.resourceUrl, locationState, { observe: 'response' });
    }

    update(locationState: ILocationState): Observable<EntityResponseType> {
        return this.http.put<ILocationState>(this.resourceUrl, locationState, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ILocationState>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ILocationState[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ILocationState[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
    }
}
