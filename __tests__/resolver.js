/* eslint-env jest */
const style9 = require('../index.js').default;

it('combines different properties', () => {
  const input = {
    a: {
      foo: 'foo'
    },
    b: {
      bar: 'bar'
    }
  };
  expect(style9(input.a, input.b)).toBe('foo bar');
});

it('merges from right to left', () => {
  const input = {
    a: {
      foo: 'foo'
    },
    b: {
      foo: 'bar'
    }
  };
  expect(style9(input.a, input.b)).toBe('bar');
});

it('ignores falsy values', () => {
  const input = {
    a: {
      foo: 'foo'
    }
  };
  expect(style9(input.a, false, undefined, null)).toBe('foo');
});

it('handles nested objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz'
      }
    },
    b: {
      foo: 'bar'
    }
  };
  expect(style9(input.a, input.b)).toBe('bar baz');
});

it('merges nested objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz'
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz'
      }
    }
  };
  expect(style9(input.a, input.b)).toBe('bar biz');
});

it('handles deeply nested objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar'
    }
  };
  expect(style9(input.a, input.b)).toBe('bar baz bop');
});

it('merges deeply nested objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    }
  };
  expect(style9(input.a, input.b)).toBe('bar biz bip');
});

it('merges several deeply nested objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    },
    c: {
      foo: 'bup',
      first: {
        foo: 'bap'
      }
    }
  };
  expect(style9(input.a, input.b, input.c)).toBe('bup bap bip');
});

it('does not modify objects', () => {
  const input = {
    a: {
      foo: 'foo',
      first: {
        foo: 'baz',
        second: {
          foo: 'bop'
        }
      }
    },
    b: {
      foo: 'bar',
      first: {
        foo: 'biz',
        second: {
          foo: 'bip'
        }
      }
    }
  };
  const clone = JSON.parse(JSON.stringify(input));
  style9(input.a, input.b);
  expect(input).toEqual(clone);
});

it('create should throw', () => {
  expect(() => style9.create({})).toThrow(
    new Error('style9.create calls should be compiled away')
  );
});

it('keyframes should throw', () => {
  expect(() => style9.keyframes({})).toThrow(
    new Error('style9.keyframes calls should be compiled away')
  );
});
