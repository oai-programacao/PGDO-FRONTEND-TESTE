import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportDiagnosticService {

  private readonly urlApi = environment.apiUrl + '/panel-pgdo';
  private readonly http = inject(HttpClient);

  private get(path: string, startDate: string, endDate: string): Observable<Blob> {
    return this.http.get(`${this.urlApi}${path}`, {
      params: { startDate, endDate },
      responseType: 'blob',
    });
  }

  getOverralVolumeOsReport(startDate: string, endDate: string): Observable<Blob> {
    return this.get('/overral-volume-os/report', startDate, endDate);
  }

  getDistribuitionOsReport(startDate: string, endDate: string): Observable<Blob> {
    return this.get('/distribuition-os/report', startDate, endDate);
  }

  getOperationCrewReport(startDate: string, endDate: string): Observable<Blob> {
    return this.get('/operation-crew/report', startDate, endDate);
  }

  getOsTypeDistributionReport(startDate: string, endDate: string): Observable<Blob> {
    return this.get('/os-type-distribution/report', startDate, endDate);
  }

  getTimeEfficiencyReport(startDate: string, endDate: string): Observable<Blob> {
    return this.get('/time-efficiency/report', startDate, endDate);
  }
}