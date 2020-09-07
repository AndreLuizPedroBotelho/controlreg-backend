const connection = () => {
  const databases = {
    test: {
      type: 'sqlite',
      synchronize: true,
      database: './database.sqlite',
      logging: false,
      entities: ['src/modules/**/entities/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      dropSchema: true,
      cli: {
        entitiesDir: 'src/modules/**/entities',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
    },
    development: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      logging: false,
      entities: [process.env.DB_ENTITIES],
      migrations: [process.env.DB_MIGRATIONS],
      subscribers: [process.env.DB_SUBSCRIBERS],
      cli: {
        entitiesDir: process.env.DB_ENTITIES_DIR,
        migrationsDir: process.env.DB_MIGRATIONS_DIR,
        subscribersDir: process.env.DB_SUBSCRIBERS_DIR,
      },
    },
  };

  return databases[process.env.NODE_ENV || 'development'];
};

export default connection();
