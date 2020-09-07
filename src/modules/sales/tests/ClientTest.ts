import faker from 'faker';
import { createTypeormConn, deleteTypeormConn } from '../../../shared/typeorm';
import { Client } from '../entities/Client';
import ClientController from '../controllers/ClientController';
import { ClientFactory } from '../factories/ClientFactory';

let clientController: ClientController;
let clientFactory: ClientFactory;

describe('ClientTest', () => {
  beforeAll(async () => {
    await createTypeormConn();
  });

  afterAll(async () => {
    await deleteTypeormConn();
  });

  beforeEach(() => {
    clientController = new ClientController();
    clientFactory = new ClientFactory();
  });

  it('should be able to create client', async () => {
    const client = await clientFactory.create(clientController);
    expect(client).toHaveProperty('id');
  });

  it('should be able to update client', async () => {
    const client = await clientFactory.create(clientController);

    client.name = faker.name.findName();

    const response = await clientController.update(client, client.id);

    expect(response.name).toBe(client.name);
    expect(response.id).toBe(client.id);
  });

  it("shouldn't be able to update client", async () => {
    const client = new Client();

    client.name = faker.name.findName();
    client.cellphone = faker.phone.phoneNumber('032########');

    await expect(clientController.update(client, 0)).rejects.toBeInstanceOf(
      Error
    );
  });

  it('should be able to delete client', async () => {
    const client = await clientFactory.create(clientController);

    const response = await clientController.delete(client.id);

    expect(response).toEqual('Client was delete');
  });

  it("shouldn't be able to delete client", async () => {
    await expect(clientController.delete(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list one client', async () => {
    const client = await clientFactory.create(clientController);

    const response = await clientController.show(client.id);

    expect(response).toEqual(client);
  });

  it("shouldn't be able to list one client", async () => {
    await expect(clientController.show(0)).rejects.toBeInstanceOf(Error);
  });

  it('should be able to list all client', async () => {
    const client1 = await clientFactory.create(clientController);
    const client2 = await clientFactory.create(clientController);
    const client3 = await clientFactory.create(clientController);

    const clients = await clientController.index();

    expect(clients).toEqual(
      expect.arrayContaining([client1, client2, client3])
    );
  });
});
