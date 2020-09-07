import { Company } from '../entities/Company';

export interface ICompanyIndex {
  count: number;
  companies: Company[];
}
