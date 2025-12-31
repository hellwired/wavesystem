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
exports.RegisterUserUseCase = void 0;
const User_entity_1 = require("../../core/atoms/User.entity");
const UserRepository_1 = require("../../core/molecules/UserRepository");
class RegisterUserUseCase {
    constructor() {
        this.userRepo = new UserRepository_1.UserRepository();
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Check if user exists (Molecule interaction)
            const existingUser = yield this.userRepo.findByEmail(data.email);
            if (existingUser) {
                throw new Error("User with this email already exists");
            }
            // Step 2: Create Atom instance
            const newUser = new User_entity_1.User();
            newUser.name = data.name;
            newUser.email = data.email;
            // Step 3: Save (Molecule interaction)
            return this.userRepo.save(newUser);
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
