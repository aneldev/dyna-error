import {
  dynaError,
  IDynaError,
} from "../../src";

describe('dynaError', () => {
  describe('with error config', () => {
    it('Minimal use, just with a message', () => {
      try {
        throw dynaError({message: 'Something is invalid'});
      }
      catch (e) {
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
        expect(error.parentError).toBe(undefined);
        expect(error.validationErrors).toBe(undefined);
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
          parentError: {message: 'Parent error'},
          validationErrors: {name: 'Is required'},
          data: {userId: 230130042},
        });
      }
      catch (e) {
        const error: IDynaError = e;
        expect(error).toMatchSnapshot();
        expect((error.stack || '').length).toBeGreaterThan(0);
        expect(error.isDynaError).toBe(true);
        expect(error.date).not.toBe(undefined);
        expect(error.date.valueOf()).toBeGreaterThan(0);
        expect(error.parentError.message).toBe('Parent error');
        expect(error.validationErrors?.name).toBe('Is required');
        expect(error.message).toBe('330010 Something is invalid');
        expect(error.userMessage).toBe('Please retry');
        expect(error.code).toBe(330010);
        expect(error.status).toBe(500);
        expect(error.canRetry).toBe(false);
        expect(error.data.userId).toBe(230130042);
      }
    });
  });
  describe('with string argument', () => {
    test('Error with string arg', () => {
      try {
        throw dynaError('Something is invalid');
      }
      catch (e) {
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
  });
});
