import { expect } from 'chai'
import { Customer } from '../src/customer'

describe('A Customer', () => {
  it('greets', () => {
    const cust = new Customer('Toto')
    expect(cust.greet()).to.equal(` ____________
< Hello Toto >
 ------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`)
  })
})
