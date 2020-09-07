import { Repository, getRepository, Not, Raw } from 'typeorm';
import { classToClass } from 'class-transformer';
import { IUserIndex } from '../interfaces/User';
import { TypeUser } from '../../../shared/enuns';
import { Company } from '../../sales/entities/Company';
import { UserUpdateInput, UserInput } from '../inputs/UserInput';
import { User } from '../entities/User';
import { IContextPayload } from '../../../shared/dtos/IContext';

export default class UserController {
  private ormRepository: Repository<User>;

  private ormCompanyRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(User);
    this.ormCompanyRepository = getRepository(Company);
  }

  public async create({
    name,
    email,
    password,
    typeUser,
    companies,
  }: UserInput): Promise<User> {
    const userValid = await this.ormRepository.findOne({
      where: {
        email,
      },
    });

    if (userValid) {
      throw new Error('Ja existe usuário com esse email');
    }

    if (typeUser !== TypeUser.ADMIN && typeUser !== TypeUser.SALESMAN) {
      throw new Error('Tipo inválido');
    }

    if (!companies && typeUser === TypeUser.SALESMAN) {
      throw new Error('Usuário é um vendedor é não tem uma emprea vinculada');
    }

    const newCompanies: Company[] = [];

    if (companies && typeUser === TypeUser.SALESMAN) {
      for (const company of companies) {
        const newCompany = await this.ormCompanyRepository.findOne(company);

        if (!newCompany) {
          throw new Error('Empresa não existe');
        }

        newCompanies.push(newCompany);
      }
    }

    const user = await this.ormRepository.create({
      name,
      email,
      password,
      typeUser,
    });

    user.companies = newCompanies;

    await user.save();

    user.sales = [];

    return classToClass(user);
  }

  public async update(
    { name, email, password, typeUser, companies }: UserUpdateInput,
    id: number
  ): Promise<User> {
    const userValid = await User.findOne({
      where: {
        email,
        id: Not(id),
      },
    });

    if (userValid) {
      throw new Error('Ja existe usuário com esse email');
    }

    const user = await this.ormRepository.findOne(id);

    if (!user) {
      throw new Error('Usuário não existe');
    }

    if (
      typeUser &&
      typeUser !== TypeUser.ADMIN &&
      typeUser !== TypeUser.SALESMAN
    ) {
      throw new Error('Tipo inválido');
    }

    if (companies && typeUser === TypeUser.SALESMAN) {
      user.companies = [];

      for (const company of companies) {
        const newCompany = await this.ormCompanyRepository.findOne(company);

        if (!newCompany) {
          throw new Error('Empresa não existe');
        }
        user.companies.push(newCompany);
      }
    }

    Object.assign(user, { name, email, typeUser });

    if (password) {
      const isOld = await user.checkpassword(password);

      if (!isOld) {
        user.password = password;
        await user.updatePassword();
      }
    }
    await user.save();

    return classToClass(user);
  }

  public async delete(id: number): Promise<string> {
    const user = await this.ormRepository.findOne(id);

    if (!user) {
      throw new Error('Usuário não existe');
    }

    await user.remove();

    return 'User foi deletado!';
  }

  public async index(
    page: number,
    limit: number,
    nameSearch: string,
    { user }: IContextPayload
  ): Promise<IUserIndex> {
    const [users, userCount] = await this.ormRepository.findAndCount({
      relations: ['companies', 'sales'],
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
      },
      where: {
        name: Raw(
          alias => `Lower(${alias}) like '%${nameSearch.toLowerCase()}%'`
        ),
        userId: user.typeUser === TypeUser.ADMIN ? Not(0) : user.id,
        typeUser: TypeUser.SALESMAN,
      },
    });

    return {
      count: userCount,
      users: classToClass(users),
    };
  }

  public async show(id: number): Promise<User> {
    const user = await this.ormRepository.findOne(id, {
      relations: ['companies', 'sales'],
    });

    if (!user) {
      throw new Error("User doesn't exist");
    }

    return classToClass(user);
  }
}
