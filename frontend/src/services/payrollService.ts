

import API from "../api/axios";


const BASE_PATH = "payroll";

// ==========================================
// Company Policy Routes
// ==========================================

export const getPolicy = (slug: string) => {
  return API.get(`/${BASE_PATH}/${slug}/policy`);
};

export const updatePolicy = (slug: string, policyData: any) => {
  return API.post(`/${BASE_PATH}/${slug}/policy`, policyData);
};

// ==========================================
// Dashboard & Summary Routes
// ==========================================

export const getSummary = (slug: string) => {
  return API.get(`/payroll/${slug}/summary`);
};

export const getStats = (slug: string) => {
  return API.get(`/payroll/${slug}/stats`);
};

export const getEmployees = (slug: string) => {
  return API.get(`/payroll/${slug}/employees`);
};

// ==========================================
// Salary Structure Setup
// ==========================================

export const setStructure = (slug: string, structureData: any) => {
  return API.post(`/${BASE_PATH}/${slug}/structure`, structureData);
};

export const getStructure = (slug: string, employeeId: string) => {
  return API.get(`/${BASE_PATH}/${slug}/structure/${employeeId}`);
};

// ==========================================
// Monthly Payroll Processing
// ==========================================

export const runMonthly = (slug: string, payrollData: any) => {
  return API.post(`/${BASE_PATH}/${slug}/run`, payrollData);
};

export const getMonthlyList = (
  slug: string,
  params?: { month?: number; year?: number }
) => {
  return API.get(`/payroll/${slug}/monthly`, { params });
};

export const deleteDraft = (slug: string, payrollId: string) => {
  return API.delete(`/${BASE_PATH}/${slug}/draft/${payrollId}`);
};

// ==========================================
// Individual Payroll Slip Management
// ==========================================

export const getSlipDetails = (slug: string, slipId: string) => {
  return API.get(`/${BASE_PATH}/${slug}/slip/${slipId}`);
};

export const markSlipPaid = (
  slug: string,
  slipId: string,
  paymentData: any
) => {
  return API.patch(
    `/${BASE_PATH}/${slug}/slip/${slipId}/mark-paid`,
    paymentData
  );
};

export const downloadSlipPdf = async (
  slug: string,
  slipId: string
): Promise<Blob> => {
  const response = await API.get(
    `/${BASE_PATH}/${slug}/slip/${slipId}/download`,
    { responseType: "blob" }
  );
  return response.data;
};

// ==========================================
// Employee Self-Service Route
// ==========================================

export const getMyHistory = (slug: string) => {
  return API.get(`/${BASE_PATH}/${slug}/my-history`);
};





export const getPayrollConfig = async (slug: string) => {
  return API.get(`/${BASE_PATH}/${slug}/config`);
};

export const updatePayrollConfig = async (
  slug: string,
  data: any
) => {
  return API.patch(
    `/${BASE_PATH}/${slug}/config`,
    data
  );
};