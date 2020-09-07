import { Repository, getRepository, Raw, Not } from 'typeorm';
import { ClientUpdateInput, ClientInput } from '../inputs/ClientInput';
import { Client } from '../entities/Client';
import { IClientIndex } from '../interfaces/Client';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { TypeUser } from '../../../shared/enuns';

export default class ClientController {
  private ormRepository: Repository<Client>;

  constructor() {
    this.ormRepository = getRepository(Client);
  }

  public async create(
    { name, cellphone }: ClientInput,
    userId: number
  ): Promise<Client> {
    const client = await this.ormRepository
      .create({ name, cellphone, userId })
      .save();
    return client;
  }

  public async update(
    { name, cellphone }: ClientUpdateInput,
    id: number,
    { user }: IContextPayload
  ): Promise<Client> {
    const client = await this.ormRepository.findOne(id);

    if (!client) {
      throw new Error('Cliente não existe');
    }

    if (client.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    Object.assign(client, { name, cellphone });

    await client.save();
    return client;
  }

  public async delete(id: number, { user }: IContextPayload): Promise<string> {
    const client = await this.ormRepository.findOne(id);

    if (!client) {
      throw new Error('Cliente não existe');
    }

    if (client.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    await client.remove();

    return 'Cliente foi deletado';
  }

  public async index(
    page: number,
    limit: number,
    nameSearch: string,
    { user }: IContextPayload
  ): Promise<IClientIndex> {
    const [clients, clientCount] = await this.ormRepository.findAndCount({
      relations: ['sales', 'sales.product'],

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
      },
    });

    return {
      count: clientCount,
      clients,
    };
  }

  public async show(id: number, { user }: IContextPayload): Promise<Client> {
    const client = await this.ormRepository.findOne(id);
    if (!client) {
      throw new Error('Cliente não existe');
    }

    if (client.userId !== user.id && user.typeUser !== TypeUser.ADMIN) {
      throw new Error('Ação não permitida');
    }

    return client;
  }
}
