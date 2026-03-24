import API from "../api/axios";

/**
 * Fetches the organization's leave policy.
 */
export const getLeavePolicy = (organizationId: any) =>
  API.get(`/${organizationId}/leave-policy`);

/**
 * Updates the organization's leave policy (Admin action).
 * @param {object} data - Policy data { casual, sick, paid }
 */
export const updateLeavePolicy = (organizationId: any, data: any) =>
  API.put(`/${organizationId}/leave-policy`, data);