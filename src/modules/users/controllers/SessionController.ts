import { Repository, getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { classToClass } from 'class-transformer';
import { User } from '../entities/User';
import auth from '../../../shared/config/auth';
import ILoginDTO from '../dtos/IUserDTO';

export default class SessionController {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(email: string, password: string): Promise<ILoginDTO> {
    const user = await this.ormRepository.findOne({
      relations: ['companies'],

      where: {
        email,
      },
    });

    if (!user) {
      throw new Error('Não existe usuário com esse email');
    }

    const valid = await user.checkpassword(password);

    if (!valid) {
      throw new Error('O email/senha esta inválido!');
    }

    const accessToken = sign({ user: classToClass(user) }, auth.secret);

    return {
      accessToken,
    };
  }
}
