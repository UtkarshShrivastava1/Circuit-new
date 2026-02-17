import type { UserRole } from "./attendance";

export type Member={
  id: string;
  name: string;
  email: string;
  role:UserRole;
  dateOfBirth?:number;
  imgUrl?: string;
  status?: "active" | "inactive";
  joinedAt?: string;
  phone?: string;
  gender?: string;
  address?:string;
}