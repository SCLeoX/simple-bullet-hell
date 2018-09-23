const RandomRaw = require('./external/random.js');

const MAX_32_BIT_UINT = 4294967295;

export class Random {
  private randomRaw: any;
  public constructor(seed: Random | number) {
    let seedNumber: number;
    if (typeof seed === 'number') {
      seedNumber = seed;
    } else {
      seedNumber = seed.nextInteger();
    }
    this.randomRaw = new RandomRaw(
      RandomRaw.engines.mt19937().seed(seedNumber)
    );
  }
  public nextInteger(min: number = 0, max: number = MAX_32_BIT_UINT): number {
    return this.randomRaw.integer(min, max);
  }
  public nextReal(
    min: number = 0,
    max: number = 1,
    inclusive: boolean = false,
  ) {
    return this.randomRaw.real(min, max, inclusive);
  }
  public nextRandom(): Random {
    return new Random(this);
  }
  public shuffle(arr: Array<any>) {
    this.randomRaw.shuffle(arr);
  }
}
