import "jest";

import {dynaError, IDynaError} from "../../src/dynaError";

describe('dynaError', () => {
  it('Minimal use, just with a message', () => {
    try {
      throw dynaError({message: 'Something is invalid'});
    } catch (e) {
      const error: IDynaError = e;
      expect(error).toMatchSnapshot();
      expect((error.stack || '').length).toBeGreaterThan(0);
      expect(error.isDynaError).toBe(true);
      expect(error.date).not.toBe(undefined);
      expect(error.date.valueOf()).toBeGreaterThan(0);
      expect(error.message).toBe('Something is invalid');
      expect(error.userMessage).toBe(undefined);
      expect(error.code).toBe(undefined);
      expect(error.status).toBe(undefined);
      expect(error.data).toBe(undefined);
      expect(error.canRetry).toBe(undefined);
    }
  });
  it('Use with all properties', () => {
    try {
      throw dynaError({
        message: 'Something is invalid',
        userMessage: 'Please retry',
        code: 330010,
        status: 500,
        canRetry: false,
        data: {
          userId: 230130042,
        },
      });
    } catch (e) {
      const error: IDynaError = e;
      expect(error).toMatchSnapshot();
      expect((error.stack || '').length).toBeGreaterThan(0);
      expect(error.isDynaError).toBe(true);
      expect(error.date).not.toBe(undefined);
      expect(error.date.valueOf()).toBeGreaterThan(0);
      expect(error.message).toBe('Something is invalid');
      expect(error.userMessage).toBe('Please retry');
      expect(error.code).toBe(330010);
      expect(error.status).toBe(500);
      expect(error.canRetry).toBe(false);
      expect(error.data.userId).toBe(230130042);
    }
  });
});