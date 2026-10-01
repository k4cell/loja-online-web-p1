import { ItemCesta } from './item-cesta';
import { Produto } from './produto';

describe('ItemCesta', () => {
  it('should create an instance', () => {
    expect(new ItemCesta(new Produto())).toBeTruthy();
  });
});