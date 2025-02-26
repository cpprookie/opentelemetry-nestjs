/* eslint-disable @typescript-eslint/no-empty-function */
import { MetadataScanner } from './MetaScanner';

describe('MetadataScanner', () => {
  let scanner: MetadataScanner;
  beforeEach(() => {
    scanner = new MetadataScanner();
  });
  describe('scanFromPrototype', () => {
    class Parent {
      constructor() {}
      public testParent() {}
      public testParent2() {}
      get propParent() {
        return '';
      }
      set valParent(value) {}
    }

    class Test extends Parent {
      constructor() {
        super();
      }
      get prop() {
        return '';
      }
      set val(value) {}
      public test() {}
      public test2() {}
    }

    it('should return only methods', () => {
      const methods = scanner.getAllMethodNames(Test.prototype);
      expect(methods).toStrictEqual([
        'test',
        'test2',
        'testParent',
        'testParent2',
      ]);
    });

    it('should return the same instance for the same prototype', () => {
      const methods1 = scanner.getAllMethodNames(Test.prototype);
      const methods2 = scanner.getAllMethodNames(Test.prototype);
      expect(methods1 === methods2).toBeTruthy();
    });

    it('should keep compatibility with older methods', () => {
      const methods1 = scanner
        .getAllMethodNames(Test.prototype)
        .map((m) => m[0]);
      const methods2 = scanner.scanFromPrototype(
        new Test(),
        Test.prototype,
        (r) => r[0],
      );

      expect(methods1).toEqual(methods2);

      const methods3 = scanner.getAllMethodNames(Test.prototype);
      const methods4 = [
        ...new Set(scanner.getAllFilteredMethodNames(Test.prototype)),
      ];

      expect(methods3).toEqual(methods4);
    });
  });
});
