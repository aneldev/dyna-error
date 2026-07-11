import {
  dynaError,
  DynaError,
  IDynaError,
} from "./";

describe('dynaError', () => {
  describe('with error config', () => {
    it('Minimal use, dynaError() - just with a message', () => {
      try {
        throw dynaError({message: 'Something is invalid'});
      }
      catch (e) {
        const error = e as IDynaError;
        expect(clearForSnapshot(error)).toMatchSnapshot();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DynaError);
        expect(error.stack?.length).toBeGreaterThan(0);
        expect(error.isDynaError).toBe(true);
        expect(error.date?.valueOf()).toBeGreaterThan(0);
        expect(error.message).toBe('Something is invalid');
        expect(error.userMessage).toBe(undefined);
        expect(error.code).toBe(undefined);
        expect(error.status).toBe(undefined);
        expect(error.data).toBe(undefined);
        expect(error.userData).toBe(undefined);
        expect(error.parentError).toBe(undefined);
        expect(error.validationErrors).toBe(undefined);
        expect(error.canRetry).toBe(undefined);
      }
    });
    it('Minimal use, new DynaError() - just with a message', () => {
      try {
        throw new DynaError();
      }
      catch (e) {
        const error = e as IDynaError;
        expect(clearForSnapshot(error)).toMatchSnapshot();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DynaError);
        expect(error.stack?.length).toBeGreaterThan(0);
        expect(error.isDynaError).toBe(true);
        expect(error.date?.valueOf()).toBeGreaterThan(0);
        expect(error.message).toBe('Unknown dyna error');
      }
    });
    it('Minimal use, new DynaError({message}) - just with a message', () => {
      try {
        throw new DynaError({message: "Something went wrong"});
      }
      catch (e) {
        const error = e as IDynaError;
        expect(clearForSnapshot(error)).toMatchSnapshot();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(DynaError);
        expect(error.stack?.length).toBeGreaterThan(0);
        expect(error.isDynaError).toBe(true);
        expect(error.date?.valueOf()).toBeGreaterThan(0);
        expect(error.message).toBe('Something went wrong');
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
          userData: {level: 'basic'},
          prefixMessageWithCode: true,
        });
      }
      catch (e) {
        const error = e as IDynaError;
        expect(clearForSnapshot(error)).toMatchSnapshot();
        expect(error.stack?.length).toBeGreaterThan(0);
        expect(error.isDynaError).toBe(true);
        expect(error.date?.valueOf()).toBeGreaterThan(0);
        expect(error.parentError.message).toBe('Parent error');
        expect(error.validationErrors?.name).toBe('Is required');
        expect(error.message).toBe('330010: Something is invalid');
        expect(error.userMessage).toBe('Please retry');
        expect(error.code).toBe(330010);
        expect(error.status).toBe(500);
        expect(error.canRetry).toBe(false);
        expect(error.data.userId).toBe(230130042);
        expect(error.userData.level).toBe('basic');
      }
    });
  });
  describe('with string argument', () => {
    test('Error with string arg', () => {
      try {
        throw dynaError('Something is invalid');
      }
      catch (e) {
        const error = e as IDynaError;
        expect(clearForSnapshot(error)).toMatchSnapshot();
        expect((error.stack || '').length).toBeGreaterThan(0);
        expect(error.stack?.length).toBeGreaterThan(0);
        expect(error.date?.valueOf()).toBeGreaterThan(0);
        expect(error.message).toBe('Something is invalid');
        expect(error.userMessage).toBe(undefined);
        expect(error.code).toBe(undefined);
        expect(error.status).toBe(undefined);
        expect(error.data).toBe(undefined);
        expect(error.userData).toBe(undefined);
        expect(error.canRetry).toBe(undefined);
      }
    });
  });
  test('From native Error', () => {
    const error = dynaError(new Error("Something went wrong"));
    expect(clearForSnapshot(error)).toMatchSnapshot();
  });

  describe('with an IDynaError argument', () => {
    it('copies all properties of the given IDynaError', () => {
      const source = dynaError({
        message: 'Something is invalid',
        userMessage: 'Please retry',
        code: 330010,
        status: 500,
        canRetry: false,
        parentError: {message: 'Parent error'},
        validationErrors: {name: 'Is required'},
        data: {userId: 230130042},
        userData: {level: 'basic'},
      });

      const error = dynaError(source);

      expect(error).toBeInstanceOf(DynaError);
      expect(error.isDynaError).toBe(true);
      expect(error.message).toBe(source.message);
      expect(error.userMessage).toBe('Please retry');
      expect(error.code).toBe(330010);
      expect(error.status).toBe(500);
      expect(error.canRetry).toBe(false);
      expect(error.parentError).toEqual({message: 'Parent error'});
      expect(error.validationErrors).toEqual({name: 'Is required'});
      expect(error.data).toEqual({userId: 230130042});
      expect(error.userData).toEqual({level: 'basic'});
      expect(error.date).toEqual(source.date);
      expect(error.stack).toBe(source.stack);
    });

    it('does not double-prefix the message with the code', () => {
      const source = dynaError({
        message: 'Something is invalid',
        code: 330010,
        prefixMessageWithCode: true,
      });
      expect(source.message).toBe('330010: Something is invalid');

      const error = dynaError(source);
      expect(error.message).toBe('330010: Something is invalid');
      expect(error.code).toBe(330010);
    });
  });

  test('JSON.stringify round-trip', () => {
    const error = dynaError({
      message: 'Something failed',
      code: 404,
      status: 500,
      userMessage: 'Not found',
      canRetry: true,
      data: {id: 1},
      userData: {level: 'basic'},
      parentError: {message: 'Root cause'},
      validationErrors: {field: 'Required'},
    });
    const parsed = JSON.parse(JSON.stringify(error));
    expect(parsed.message).toBe('Something failed');
    expect(parsed.code).toBe(404);
    expect(parsed.status).toBe(500);
    expect(parsed.userMessage).toBe('Not found');
    expect(parsed.canRetry).toBe(true);
    expect(parsed.data.id).toBe(1);
    expect(parsed.userData.level).toBe('basic');
    expect(parsed.parentError.message).toBe('Root cause');
    expect(parsed.validationErrors.field).toBe('Required');
    expect(parsed.isDynaError).toBe(true);
    expect(parsed.name).toBe('Error');
    expect(parsed.stack).toBeUndefined();
  });
});

const clearForSnapshot = (error: IDynaError): any => {
  const output = {...error};
  delete output.date;
  delete output.stack;
  return output;
};
