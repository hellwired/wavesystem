"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("../../core/atoms/User.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Admin001",
    database: "atoms",
    synchronize: true, // Auto create tables for demo
    logging: false,
    entities: [User_entity_1.User],
    subscribers: [],
    migrations: [],
});
