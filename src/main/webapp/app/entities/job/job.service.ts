import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IJob } from 'app/shared/model/job.model';

type EntityResponseType = HttpResponse<IJob>;
type EntityArrayResponseType = HttpResponse<IJob[]>;

@Injectable({ providedIn: 'root' })
export class JobService {
    private resourceUrl = SERVER_API_URL + 'api/jobs';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/jobs';

    constructor(private http: HttpClient) {}

    create(job: IJob): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(job);
        return this.http
            .post<IJob>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(job: IJob): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(job);
        return this.http
            .put<IJob>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IJob>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IJob[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    search(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IJob[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    private convertDateFromClient(job: IJob): IJob {
        const copy: IJob = Object.assign({}, job, {
            jobDate: job.jobDate != null && job.jobDate.isValid() ? job.jobDate.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.jobDate = res.body.jobDate != null ? moment(res.body.jobDate) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((job: IJob) => {
            job.jobDate = job.jobDate != null ? moment(job.jobDate) : null;
        });
        return res;
    }
}
