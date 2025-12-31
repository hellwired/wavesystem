import { DataSource } from "typeorm";
import { User } from "../../core/atoms/User.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Admin001",
    database: "atoms",
    synchronize: true, // Auto create tables for demo
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});
