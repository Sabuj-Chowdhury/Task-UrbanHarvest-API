export interface IVendorPayload {
  farmName: string;
  farmLocation: string;
}

export interface IVendorRequest {
  userId: string;
  farmName: string;
  farmLocation: string;
}

export interface ICertificatePayload {
  certifyingAgency: string;
  certificationDate: string;
}
