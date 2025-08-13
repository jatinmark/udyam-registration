export interface Step1Data {
  aadhaar: string;
  nameAsPerAadhaar: string;
  disclaimer: boolean;
}

export interface Step2Data {
  typeOfOrganisation: string;
  pan: string;
  mobile: string;
  email: string;
  socialCategory: string;
  gender: string;
  speciallyAbled: string;
  nameOfEnterprise: string;
  majorActivity: string;
}

export interface RegistrationData extends Step1Data, Step2Data {
  registrationNumber?: string;
  registrationDate?: string;
  registrationId?: number;
}

export interface RegistrationResponse {
  registrationNumber: string;
  registrationDate: string;
  nameOfEnterprise: string;
}

export interface FormData {
  step1: Partial<Step1Data>;
  step2: Partial<Step2Data>;
  registration: RegistrationResponse | null;
}