import API from "../api/axios";

export const createLead = (slug:string, data:any) => {
  return API.post(`/leads/${slug}/create`, data);
};

export const getAllLeads = (slug:string) => {
  return API.get(`/leads/${slug}/getAllLeads`);
};  
export const updateLead = (slug:string, leadId:string, data:any) => {
  return API.put(`/leads/${slug}/updateLead/${leadId}`, data);
};

export const deleteLead = (slug:string, leadId:string) => {
  return API.delete(`/leads/${slug}/deleteLead/${leadId}`);
};
export const createAccount = (slug:string, data:any ) => {
  return API.post(`/accounts/${slug}/create`, data);
};

export const getAllAccounts = (slug:string) => {
  return API.get(`/accounts/${slug}/get`);
};

export const updateAccount = (slug:string, accountId:string , data:any) => {
  return API.put(`/accounts/${slug}/update/${accountId}`, data);
};

export const deleteAccount = (slug:string, accountId:string) => {
  return API.delete(`/accounts/${slug}/delete/${accountId}`);
};