/* eslint-disable @typescript-eslint/no-var-requires */
const cowsay = require('cowsay')

export class Customer {
  readonly name: string

  /**
   * This is a Customer, the most important thing, ever.
   */
  constructor(name: string) {
    this.name = name
  }

  /**
   * This method makes the customer greet.
   */
  greet(): string {
    return cowsay.say({ text: `Hello ${this.name}` })
  }
}
