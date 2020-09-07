import { ClientResolver } from '../modules/sales/resolvers/ClientResolver';
import { CompanyResolver } from '../modules/sales/resolvers/CompanyResolver';
import { ProductResolver } from '../modules/sales/resolvers/ProductResolver';
import { SaleResolver } from '../modules/sales/resolvers/SaleResolver';
import { SalePaidResolver } from '../modules/sales/resolvers/SalePaidResolver';
import { ParcelSalePaidResolver } from '../modules/sales/resolvers/ParcelSalePaidResolver';
import { ReportResolver } from '../modules/sales/resolvers/ReportResolver';

import { UserResolver } from '../modules/users/resolvers/UserResolver';
import { SessionResolver } from '../modules/users/resolvers/SessionResolver';
import { ResetResolver } from '../modules/users/resolvers/ResetResolver';

export const Resolvers = [
  UserResolver,
  ClientResolver,
  CompanyResolver,
  ProductResolver,
  SalePaidResolver,
  ParcelSalePaidResolver,
  ReportResolver,
  SaleResolver,
  SessionResolver,
  ResetResolver,
];
