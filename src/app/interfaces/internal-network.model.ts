export interface CloseInternalNetworkRequest {
  serviceOrderId: string;
  contractNumber: number;
  conclusionDate: string;
  osClassification: string;
  cableMeters: number | null;
  technicalHours: number | null;
  rj45Connectors: number | null;
  additionalDescription: string | null;
  additionalValue: number | null;
  observation: string | null;
  billingDate: string | null;
}
 
export interface CloseInternalNetworkResponse {
  serviceOrderId: string;
  codeContractRbx: string;
  totalCharged: number;
  boletoLink: string | null;
  documentNumber: number | null;
  message: string;
}