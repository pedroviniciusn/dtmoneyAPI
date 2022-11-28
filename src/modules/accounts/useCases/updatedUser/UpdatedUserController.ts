import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdatedUserUseCase } from './UpdatedUserUseCase';


export class UpdatedUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const {
      name,
      email,
      password,
    } = req.body;

    const updatedUserUseCase = container.resolve(UpdatedUserUseCase);

    await updatedUserUseCase.execute({
      id,
      name,
      email,
      password,
    })

    return res.status(200).send();
  }
}