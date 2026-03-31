import API from "../api/axios";

/**
 * Fetches the logged-in employee's payroll records.
 * @param {string} slug - The organization slug.
 * @param {object} params - Query parameters (month, year, page, limit).
 * @returns {Promise} Axios promise.
 */
export const getMyPayroll = (slug: any, params?: any) => {
  return API.get(`/payroll/${slug}/my`, { params });
};

/**
 * Generates payroll for a single employee or all active employees (Admin/Manager).
 * @param {string} slug - The organization slug.
 * @param {object} data - Payroll generation data { employeeId, month, year, basicSalary, ... }.
 * @returns {Promise} Axios promise.
 */
export const generatePayroll = (slug: any, data: any) => {
  return API.post(`/payroll/${slug}/generate`, data);
};

/**
 * Fetches all payroll records for the organization (Admin/Manager).
 * @param {string} slug - The organization slug.
 * @param {object} params - Query parameters (month, year, employeeId, status, page, limit).
 * @returns {Promise} Axios promise.
 */
export const getAllPayroll = (slug: any, params?: any) => {
  return API.get(`/payroll/${slug}`, { params });
};

/**
 * Updates an existing PENDING payroll record (Admin/Manager).
 * @param {string} slug - The organization slug.
 * @param {string} id - The payroll record ID.
 * @param {object} data - Updated salary data { basicSalary, allowances, deductions, bonus }.
 * @returns {Promise} Axios promise.
 */
export const updatePayroll = (slug: any, id: any, data: any) => {
  return API.put(`/payroll/${slug}/${id}`, data);
};

/**
 * Approves a PENDING payroll record, changing status to PROCESSED (Admin/Manager).
 * @param {string} slug - The organization slug.
 * @param {string} id - The payroll record ID.
 * @returns {Promise} Axios promise.
 */
export const approvePayroll = (slug: any, id: any) => {
  return API.put(`/payroll/${slug}/${id}/approve`);
};

/**
 * Marks a PROCESSED payroll record as PAID (Admin/Manager).
 * @param {string} slug - The organization slug.
 * @param {string} id - The payroll record ID.
 * @returns {Promise} Axios promise.
 */
export const payPayroll = (slug: any, id: any) => {
  return API.put(`/payroll/${slug}/${id}/pay`);
};