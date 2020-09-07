import { Repository, getRepository } from 'typeorm';

import { User } from '../entities/User';

export default class ResetController {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async update(userId: number): Promise<string> {
    const user = await this.ormRepository.findOne(userId);

    if (!user) {
      throw new Error('Usuário não foi encontrado!');
    }

    user.password = process.env.PASSWORD_RESET || '123';

    await user.updatePassword();

    await user.save();
    return `A nova senha do usuario ${user.name} é ${process.env.PASSWORD_RESET}`;
  }
}
