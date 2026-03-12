import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import {
  AuditRequestDTO,
  AuditFlowResponseDTO,
  AuditSearchClientDTO,
  PaginationDTO,
} from "../../../interfaces/audit-request.model";

@Injectable({
  providedIn: "root",
})
export class AuditSellerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // =========================================================
  // REGISTROS
  // =========================================================
  registerFlow(body: AuditRequestDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/audit/flow`, body);
  }

  registerSearchClient(body: AuditSearchClientDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/audit/search-client`, body);
  }

  // =========================================================
  // CONSULTA COM FILTROS
  // =========================================================
  filtrar(filtros: {
    nameSeller?: string;
    cpfClientSearch?: string;
    typeFlow?: string;
    dataInicio?: string;
    dataFim?: string;
    page?: number;
    size?: number;
  }): Observable<PaginationDTO<AuditFlowResponseDTO>> {
    let params = new HttpParams();
    if (filtros.nameSeller)
      params = params.set("nameSeller", filtros.nameSeller);
    if (filtros.cpfClientSearch)
      params = params.set("cpfClientSearch", filtros.cpfClientSearch);
    if (filtros.typeFlow) params = params.set("typeFlow", filtros.typeFlow);
    if (filtros.dataInicio)
      params = params.set("dataInicio", filtros.dataInicio);
    if (filtros.dataFim) params = params.set("dataFim", filtros.dataFim);
    params = params.set("page", filtros.page ?? 0);
    params = params.set("size", filtros.size ?? 20);

    return this.http.get<PaginationDTO<AuditFlowResponseDTO>>(
      `${this.apiUrl}/audit/filter`,
      { params },
    );
  }
}
