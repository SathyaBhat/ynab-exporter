import { DataTypes, Sequelize } from "sequelize";
import { TransactionDetail } from "ynab";

export class DB {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "db/ynab.db",
    logging: false,
  });

  transaction = this.sequelize.define(
    "transactions",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      date: DataTypes.STRING,
      amount: DataTypes.BIGINT,
      memo: DataTypes.TEXT,
      payee: DataTypes.STRING,
    },
    {
      indexes: [
        {
          fields: ["date", "payee", "amount"],
        },
      ],
    }
  );
  constructor() {
    this.sequelize.sync();
  }

  public saveTransaction(ynabTransaction: TransactionDetail) {
    this.transaction.upsert({
      id: ynabTransaction.id,
      date: ynabTransaction.date,
      amount: ynabTransaction.amount / 1000,
      memo: ynabTransaction.memo,
      payee: ynabTransaction.payee_name,
    });
  }
}
