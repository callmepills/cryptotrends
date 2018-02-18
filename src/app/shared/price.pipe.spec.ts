import { PricePipe } from './price.pipe';

describe('PricePipe', () => {
  it('create an instance', () => {
    const pipe = new PricePipe(null, null);
    expect(pipe).toBeTruthy();
  });
});
