import { User } from "../../core/atoms/User.entity";
import { CreateUserDTO } from "../../core/atoms/UserDTOs";
import { UserRepository } from "../../core/molecules/UserRepository";

export class RegisterUserUseCase {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async execute(data: CreateUserDTO): Promise<User> {
        // Step 1: Check if user exists (Molecule interaction)
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        // Step 2: Create Atom instance
        const newUser = new User();
        newUser.name = data.name;
        newUser.email = data.email;

        // Step 3: Save (Molecule interaction)
        return this.userRepo.save(newUser);
    }
}
