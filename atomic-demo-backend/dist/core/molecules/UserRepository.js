"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_entity_1 = require("../atoms/User.entity");
const data_source_1 = require("../../infrastructure/database/data-source");
class UserRepository {
    constructor() {
        this.repo = data_source_1.AppDataSource.getRepository(User_entity_1.User);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findOne({ where: { email } });
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.save(user);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repo.findOne({ where: { id } });
        });
    }
}
exports.UserRepository = UserRepository;
