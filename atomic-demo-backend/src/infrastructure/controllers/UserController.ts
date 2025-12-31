import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../domain/organisms/RegisterUserUseCase";

export class UserController {
    private registerUseCase: RegisterUserUseCase;

    constructor() {
        this.registerUseCase = new RegisterUserUseCase();
    }

    // This acts as the "Template" or "Page" entry point
    register = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }

            const user = await this.registerUseCase.execute({ name, email });
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
