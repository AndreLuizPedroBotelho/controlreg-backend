import { createConnection, Connection, getConnection } from 'typeorm';
import configDatabase from '../config/database';

export const createTypeormConn = async (): Promise<Connection> => {
  const connection = await createConnection({
    ...configDatabase,
    name: 'default',
  });

  if (process.env.NODE_ENV === 'test') {
    await connection.query('PRAGMA foreign_keys=ON;');

    await connection.synchronize();
    await connection.query('PRAGMA foreign_keys=OFF;');
  }

  return connection;
};

export const deleteTypeormConn = async (): Promise<void> => {
  const connection = await getConnection();

  await connection.close();
};
