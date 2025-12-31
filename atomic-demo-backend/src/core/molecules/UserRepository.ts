import { Repository } from "typeorm";
import { User } from "../atoms/User.entity";
import { AppDataSource } from "../../infrastructure/database/data-source";

export class UserRepository {
    private repo: Repository<User>;

    constructor() {
        this.repo = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repo.findOne({ where: { email } });
    }

    async save(user: User): Promise<User> {
        return this.repo.save(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.repo.findOne({ where: { id } });
    }
}
