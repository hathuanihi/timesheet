import { toIError, getErrorMessage } from './errorHandler';
import { IError } from '@/types/abp.type';

describe('Error Utils', () => {
  const fallbackMessage = 'An unexpected error occurred.';

  describe('toIError', () => {
    it('should parse a full Axios-like error structure', () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'Validation failed.',
              details: 'The name field is required.',
              code: null, 
            },
          },
        },
      };

      const expected: IError = {
        code: 400, 
        message: 'Validation failed.',
        details: 'The name field is required.',
      };

      expect(toIError(axiosError, fallbackMessage)).toEqual(expected);
    });

    it('should parse an object with a direct "error" property', () => {
      const directError = {
        error: {
          message: 'Direct error message.',
          details: 'Direct details here.',
        },
      };

      const expected: IError = {
        code: null,
        message: 'Direct error message.',
        details: 'Direct details here.',
      };

      expect(toIError(directError, fallbackMessage)).toEqual(expected);
    });

    it('should parse a standard JavaScript Error object', () => {
      const jsError = new Error('A simple JS error.');

      const expected: IError = {
        code: null,
        message: 'A simple JS error.',
        details: null,
      };

      expect(toIError(jsError, fallbackMessage)).toEqual(expected);
    });

    it('should parse a generic object with a message property', () => {
      const customObjectError = {
        message: 'Custom object message.',
        details: 'Custom object details.',
      };

      const expected: IError = {
        code: null,
        message: 'Custom object message.',
        details: 'Custom object details.',
      };

      expect(toIError(customObjectError, fallbackMessage)).toEqual(expected);
    });

    it('should return the fallback for a plain string error', () => {
      const stringError = 'Just a string.';

      const expected: IError = {
        code: null,
        message: fallbackMessage,
        details: null,
      };

      expect(toIError(stringError, fallbackMessage)).toEqual(expected);
    });

    it('should return the fallback for null or undefined input', () => {
      const expected: IError = {
        code: null,
        message: fallbackMessage,
        details: null,
      };

      expect(toIError(null, fallbackMessage)).toEqual(expected);
      expect(toIError(undefined, fallbackMessage)).toEqual(expected);
    });

    it('should return the fallback for an unparseable object', () => {
      const emptyObject = {};

      const expected: IError = {
        code: null,
        message: fallbackMessage,
        details: null,
      };

      expect(toIError(emptyObject, fallbackMessage)).toEqual(expected);
    });
  });

  describe('getErrorMessage', () => {
    const fallbackForGet = 'Default get message.';

    it('should return the "details" string if it exists', () => {
      const errorWithDetails = {
        response: {
          data: {
            error: {
              message: 'General error.',
              details: 'This is the specific detail.',
            },
          },
        },
      };

      expect(getErrorMessage(errorWithDetails, fallbackForGet)).toBe(
        'This is the specific detail.',
      );
    });

    it('should return the "message" string if "details" does not exist', () => {
      const errorWithMessage = {
        error: {
          message: 'This is the main message.',
        },
      };

      expect(getErrorMessage(errorWithMessage, fallbackForGet)).toBe(
        'This is the main message.',
      );
    });

    it('should return the fallback string if the error cannot be parsed into a message or details', () => {
      const unparseableError = {}; 

      expect(getErrorMessage(unparseableError, fallbackForGet)).toBe(
        fallbackForGet,
      );
    });

    it('should return the fallback for a null input', () => {
      expect(getErrorMessage(null, fallbackForGet)).toBe(fallbackForGet);
    });
  });
});