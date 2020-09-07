import faker from 'faker';

import ClientController from '../controllers/ClientController';
import { Client } from '../entities/Client';

export class ClientFactory {
  public async create(clientController: ClientController): Promise<Client> {
    const client = new Client();

    client.name = faker.name.findName();
    client.cellphone = faker.phone.phoneNumber('032########');

    const response = await clientController.create(client);

    return response;
  }
}
