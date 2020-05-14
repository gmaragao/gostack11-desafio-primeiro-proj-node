import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Unrecognized transaction type');
    }

    if (type === 'outcome') {
      const totalAvaliable = this.transactionsRepository.getBalance().total;

      if (totalAvaliable < value || totalAvaliable - value < 0) {
        throw Error(
          'This transaction cannot be created since you dont have enough income to take',
        );
      }
    }

    const newTransaction = new Transaction({ title, value, type });
    this.transactionsRepository.create(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
