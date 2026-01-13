import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';

const sequelize = new Sequelize(
    databaseConfig.database!,
    databaseConfig.username!,
    databaseConfig.password,
    {
        host: databaseConfig.host,
        port: databaseConfig.port,
        dialect: 'postgres',
        define: databaseConfig.define,
        pool: databaseConfig.pool,
        logging: databaseConfig.logging as boolean | ((sql: string) => void),
    }
);

export default sequelize;
