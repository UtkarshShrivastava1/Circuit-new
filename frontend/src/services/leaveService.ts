import API from "../api/axios";

/**
 * Submits a new leave application.
 * @param {string} organizationId - The organization's ID.
 * @param {object | FormData} leaveData - The leave data (use FormData if including file attachments).
 * @returns {Promise} Axios promise.
 */
export const applyLeave = (organizationId: any, leaveData: any) =>
  API.post(`/${organizationId}/leaves/apply`, leaveData);

/**
 * Fetches all leaves for the currently logged-in user.
 * @param {string} organizationId - The organization's ID.
 * @returns {Promise} Axios promise.
 */
export const getMyLeaves = (organizationId: any) =>
  API.get(`/${organizationId}/leaves/my`);

/**
 * Cancels a pending leave request (User/Employee action).
 * @param {string} organizationId - The organization's ID.
 * @param {string} leaveId - The ID of the leave request.
 * @returns {Promise} Axios promise.
 */
export const cancelLeave = (organizationId: any, leaveId: any) =>
  API.patch(`/${organizationId}/leaves/${leaveId}/cancel`);

/**
 * Deletes a leave request completely (User/Employee action).
 * @param {string} organizationId - The organization's ID.
 * @param {string} leaveId - The ID of the leave request.
 * @returns {Promise} Axios promise.
 */
export const deleteLeave = (organizationId: any, leaveId: any) =>
  API.delete(`/${organizationId}/leaves/${leaveId}`);

/**
 * Updates an existing leave application.
 * @param {string} organizationId - The organization's ID.
 * @param {string} leaveId - The ID of the leave request.
 * @param {object | FormData} leaveData - The updated leave data.
 * @returns {Promise} Axios promise.
 */
export const updateLeave = (organizationId: any, leaveId: any, leaveData: any) =>
  API.put(`/${organizationId}/leaves/${leaveId}`, leaveData);

/**
 * Fetches all leaves across the organization (Admin/Manager action).
 * @param {string} organizationId - The organization's ID.
 * @param {object} params - Optional query params (e.g., { status: 'pending' }).
 * @returns {Promise} Axios promise.
 */
export const getAllLeaves = (organizationId: any, params?: any) =>
  API.get(`/${organizationId}/leaves/all`, { params });

/**
 * Fetches a specific leave by its ID.
 * @param {string} organizationId - The organization's ID.
 * @param {string} leaveId - The ID of the leave request.
 * @returns {Promise} Axios promise.
 */
export const getLeaveById = (organizationId: any, leaveId: any) =>
  API.get(`/${organizationId}/leaves/${leaveId}`);

/**
 * Updates the status of a leave request (Admin/Manager action).
 * @param {string} organizationId - The organization's ID.
 * @param {string} leaveId - The ID of the leave request.
 * @param {object} statusData - The new status data (e.g., { status: 'approved', managerRemarks: 'Enjoy your time off!' }).
 * @returns {Promise} Axios promise.
 */
export const updateLeaveStatus = (organizationId: any, leaveId: any, statusData: any) =>
  API.patch(`/${organizationId}/leaves/${leaveId}/status`, statusData);

/**
 * Bulk updates the status of multiple leave requests (Admin/Manager action).
 * @param {string} organizationId - The organization's ID.
 * @param {object} data - The payload containing leaveIds, status, managerRemarks.
 * @returns {Promise} Axios promise.
 */
export const bulkUpdateLeaveStatus = (organizationId: any, data: any) =>
  API.patch(`/${organizationId}/leaves/bulk-status`, data);