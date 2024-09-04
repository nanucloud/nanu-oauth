"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../entities/user.entity");
var application_entity_1 = require("../entities/application.entity");
var auth_code_entity_1 = require("../entities/auth_code.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    entities: [user_entity_1.User, application_entity_1.Application, auth_code_entity_1.AuthCode],
    synchronize: true,
    logging: true,
});
