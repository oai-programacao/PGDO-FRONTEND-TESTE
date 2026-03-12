import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SellerService {

  private apiUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  createSeller(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}