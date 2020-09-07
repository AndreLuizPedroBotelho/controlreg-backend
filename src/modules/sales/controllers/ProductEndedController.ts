import { Repository, getRepository, Not, Equal } from 'typeorm';
import { TypeUser } from '../../../shared/enuns';
import { IContextPayload } from '../../../shared/dtos/IContext';
import { Product } from '../entities/Product';
import { IProductIndex } from '../interfaces/Product';

export default class ProductEndedController {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async productEnded(
    page: number,
    limit: number,
    { user }: IContextPayload
  ): Promise<IProductIndex> {
    const [products, productCount] = await this.ormRepository.findAndCount({
      relations: ['company'],
      skip: page,
      take: limit,
      order: {
        id: 'DESC',
      },
      where: {
        userId: user.typeUser === TypeUser.ADMIN ? Not(0) : user.id,
        amount: Equal(0),
      },
    });

    return {
      count: productCount,
      products,
    };
  }
}
