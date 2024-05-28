import { CapitalizeFirstPipe } from './capitalize-first.pipe';

describe('CapitalizeFirstPipe', () => {
  let pipe: CapitalizeFirstPipe;

  beforeEach(() => {
    pipe = new CapitalizeFirstPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize the first letter of a regular string', () => {
    expect(pipe.transform('hello')).toBe('Hello');
  });

  it('should return null when value is null', () => {
    expect(pipe.transform(null)).toBeNull();
  });
});
