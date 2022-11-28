import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../errors/AppError';
import { IUpdateUserDTO } from '../../dtos/IUpdateUserDTO';
import { IUserRepository } from '../../repositories/IUserRepository';

@injectable()
export class UpdatedUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute({
    id,
    name,
    email,
    password,
  }: IUpdateUserDTO): Promise<void> {
    const user = this.userRepository.findById(id)

    if (!user) {
      throw new AppError('User not found')
    }
    
    const passwordHash = await hash(password, 8)
    

    await this.userRepository.update({
      id,
      name,
      email,
      password: passwordHash,
    })
  }
}