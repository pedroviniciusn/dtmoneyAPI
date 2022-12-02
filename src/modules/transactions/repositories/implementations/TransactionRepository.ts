import { Repository } from 'typeorm';
import { myDataSource } from '../../../../database/app-data-source';
import { User } from '../../../accounts/entities/User';
import { ICreateTransactionsDTO } from '../../dtos/ICreateTransactionsDTO';
import { Transactions } from '../../entities/Transactions';
import { ITransactionsRepository } from '../ITransactionRepository';


export class TransactionsRepository implements ITransactionsRepository {
  private repository: Repository<Transactions>;
  private userRepository: Repository<User>;

  constructor() {
    this.repository = myDataSource.getRepository(Transactions);
    this.userRepository = myDataSource.getRepository(User);
  }

  async create({
    userId,
    title,
    amount,
    category,
    type,
  }: ICreateTransactionsDTO): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },

      relations: {
        transactions: true,
      }
    });

    const transaction = this.repository.create({
      title,
      amount,
      category,
      type,
    });

    await this.repository.save(transaction);

    if (!user.transactions) {
      user.transactions = [transaction];
    }

    user.transactions = [...user.transactions, transaction]

    await this.userRepository.save(user);
  }

  async delete(transactionId: string): Promise<void> {
    await this.repository.delete(transactionId);
  }
  
  async findById(transactionId: string): Promise<Transactions> {
    const transaction = await this.repository.findOne({
      where: {
        id: transactionId,
      }
    })

    return transaction;
  }
}
  