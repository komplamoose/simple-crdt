import CRDT from './crdt';

describe('localInsert() Test:', () => {
  let crdt: CRDT;
  beforeEach(() => {
    crdt = new CRDT();
    crdt.localInsert(0, 'A');
    crdt.localInsert(1, 'B');
    crdt.localInsert(2, 'C');
  });

  it('1. localInsert(0, "H") 테스트', () => {
    crdt.localInsert(0, 'H');
    expect(crdt.toString()).toEqual('HABC');
  });

  it('2. localInsert(3, "D") 테스트', () => {
    crdt.localInsert(3, 'D');
    expect(crdt.toString()).toEqual('ABCD');
  });

  it('3. localInsert(1, "F") 테스트', () => {
    crdt.localInsert(1, 'F');
    expect(crdt.toString()).toEqual('AFBC');
  });
});

describe('generateIndex() Test:', () => {
  let crdt: CRDT;
  beforeEach(() => {
    crdt = new CRDT();
  });
  /**
   * 1. 0번 인덱스를 비교한다 1.24 => [1, 2, 4]
   * 2. 같으면 다음 인덱스를 비교한다
   * 3. 인덱스라는 변수는 => [1, 3]
   * [1, 0], [1, 1] => [1, 0, 5] 나누어진 수가 정수가 아닌 경우, 소수부를 push한다
   * 3. 다르면 [1, 2] -> [1, 5] -> [1, 5]
   * 4. 0.5랑 0.7 = 0.6 [0, 6]
   * 5. 비어있는 경우
   *   1. [] [] => newIndex = [0]
   *   2. [] [0, 5, 5] = newIndex[right - 1] [-1]
   *   3. [0] [] = newIndex[left + 1]
   */

  it('1. 양 옆에 인덱스가 존재하고 그 사이에 넣는 경우 (Default)', () => {
    expect(crdt.generateIndex([1], [2])).toEqual([1, 5]);
  });

  it('2. 둘 다 비어있는 경우, [] []', () => {
    expect(crdt.generateIndex([], [])).toEqual([0]);
  });

  it('3. 왼쪽만 비어있는 경우, [] [0]', () => {
    expect(crdt.generateIndex([], [0])).toEqual([-1]);
  });

  it('4. 오른쪽만 비어있는 경우, [0] []', () => {
    expect(crdt.generateIndex([0], [])).toEqual([1]);
  });

  it('5. 정수부는 같고 소수부가 다른 경우, [1, 2] [1, 5]', () => {
    expect(crdt.generateIndex([1, 2], [1, 5])).toEqual([1, 3, 5]);
  });

  it('6. 정수부가 음수일 경우, [-2] [-1]', () => {
    expect(crdt.generateIndex([-2], [-1])).toEqual([-1, 5]);
  });

  it('7. 정수부가 음수이면서 소수부가 두 자리 수 이상일 경우, [-1, 2, 4] [-1, 2, 2]', () => {
    expect(crdt.generateIndex([-1, 2, 4], [-1, 2, 2])).toEqual([-1, 2, 3]);
  });

  it('8. [1, 2, 3] [1, 2, 4] => [1, 2, 3, 5]', () => {
    expect(crdt.generateIndex([1, 2, 3], [1, 2, 4])).toEqual([1, 2, 3, 5]);
  });
});
