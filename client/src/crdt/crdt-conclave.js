import Char from './char';

export default class CRDT {
  constructor(id) {
    this.siteId = id;
    this.localCounter = 0;
    this.struct = [];
  }

  remoteInsert(char) {
    const index = this.findInsertIndex(char);
    this.struct.splice(index, 0, char);

    return { char: char.value, index: index };
  }

  remoteDelete(char) {
    const index = this.findIndexByPosition(char);
    if (index !== -1) {
      this.struct.splice(index, 1);
    }

    return index;
  }

  // 이진 탐색으로 최적화 가능
  // 충돌할 때 siteid로 최적화

  findInsertIndex(newChar) {
    const index = this.struct.findIndex(
      (char) => char.compareTo(char.position) === 1
    );
    return index === -1 ? this.struct.length : index;
  }

  findIndexByPosition(newChar) {
    return this.struct.findIndex((char) => char.compareTo(char.position) === 0);
  }

  localInsert(value, index) {
    const char = this.generateChar(value, index);
    this.struct.splice(index, 0, char);
    console.log(this.struct);

    return char;
  }

  localDelete(idx) {
    return this.struct.splice(idx, 1)[0];
  }

  generateChar(val, index) {
    const posBefore =
      (this.struct[index - 1] && this.struct[index - 1].position) || [];
    const posAfter = (this.struct[index] && this.struct[index].position) || [];
    const newPos = this.generatePosBetween(posBefore, posAfter);

    return new Char(val, this.localCounter, this.siteId, newPos);
  }

  // https://github.com/conclave-team/conclave/blob/4c21844513e1be41b37c3416ce7483ec5be095ef/lib/crdt.js#L376
  // case
  // 1. [0], [1]: 1이하로 차이나는 경우 [0, 5]
  //   1-1. [0, 5], [0, 7] index 0에서 같고 -> index 1에서 2번
  //   1-2. [0, 5], [0, 6] index 0에서 같고 -> index 1에서 1번 (pos1 바로 단계에 5추가 후 return)
  //   1-3. [0, 5], [0, 5] index 0에서 같고 -> index 1에서 같은데 둘다 마지막 인덱스 return pos1
  // 2. [0], [4]: 1보다 많이 차이 - 대충 나누기 2 [2]

  // if
  // [] [] -> 0
  // [0] [] -> 1
  // [] [1] -> 0
  generatePosBetween(pos1, pos2, newPos = []) {
    console.log(pos1, pos2);
    if (pos1.length === 0 && pos2.length === 0) {
      return [0];
    }
    if (pos1.length === 0) {
      return [pos2[0] - 1];
    }
    if (pos2.length === 0) {
      return [pos1[0] + 1];
    }
    if (pos2[0] - pos1[0] > 1) {
      return [...newPos, parseInt((pos2[0] - pos1[0]) / 2)];
    }
    if (pos2[0] === pos1[0]) {
      if (pos1.length === 1 && pos2.length === 1) {
        return [...newPos, pos1[0]];
      }
      return this.generatePosBetween(
        pos1.slice(1).length === 0 ? [0] : pos1.slice(1),
        pos2.slice(1).length === 0 ? [0] : pos2.slice(1),
        [...newPos, pos1[0]]
      );
    }
    // if(pos2[0] - pos1[0] < 1)
    return [...newPos, ...pos1, 5];
  }

  toString() {
    return JSON.stringify(
      this.struct.map((char) => [char.position, char.value])
    );
  }
}
