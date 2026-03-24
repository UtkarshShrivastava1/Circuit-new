import API from "../api/axios";

/**
 * Publishes a new holiday.
 * @param {string} organizationId - The organization's ID.
 * @param {object} data - Holiday data { date, title, description }.
 * @returns {Promise} Axios promise.
 */
export const addHoliday = (organizationId: any, data: any) =>
  API.post(`/${organizationId}/holidays`, data);

/**
 * Fetches all official company holidays.
 */
export const getHolidays = (organizationId: any) =>
  API.get(`/${organizationId}/holidays`);

/**
 * Updates an existing holiday.
 */
export const updateHoliday = (organizationId: any, holidayId: any, data: any) =>
  API.put(`/${organizationId}/holidays/${holidayId}`, data);

/**
 * Deletes a holiday.
 */
export const deleteHoliday = (organizationId: any, holidayId: any) =>
  API.delete(`/${organizationId}/holidays/${holidayId}`);