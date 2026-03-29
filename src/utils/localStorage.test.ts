import { getItem, setItem, removeItem, getJSONItem } from './localStorage';

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('setItem', () => {
    it('should store the value in localStorage only', () => {
      const key = 'myKey';
      const value = 'myValue';

      setItem(key, value);

      expect(localStorage.getItem(key)).toBe(value);
      expect(sessionStorage.getItem(key)).toBeNull();
    });
  });

  describe('getItem', () => {
    it('should return the value from sessionStorage if it exists there', () => {
      const key = 'sharedKey';
      const sessionValue = 'value from session';
      const localValue = 'value from local';

      sessionStorage.setItem(key, sessionValue);
      localStorage.setItem(key, localValue);

      expect(getItem(key)).toBe(sessionValue);
    });

    it('should fall back to localStorage if the value is not in sessionStorage', () => {
      const key = 'localKey';
      const localValue = 'value from local';

      localStorage.setItem(key, localValue);

      expect(getItem(key)).toBe(localValue);
    });

    it('should return null if the key exists in neither storage', () => {
      expect(getItem('nonExistentKey')).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove the key from both sessionStorage and localStorage', () => {
      const key = 'keyToRemove';
      const value = 'some value';

      sessionStorage.setItem(key, value);
      localStorage.setItem(key, value);

      expect(sessionStorage.getItem(key)).toBe(value);
      expect(localStorage.getItem(key)).toBe(value);

      removeItem(key);

      expect(sessionStorage.getItem(key)).toBeNull();
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  describe('getJSONItem', () => {
    it('should return a parsed JSON object if the value is a valid JSON string', () => {
      const key = 'userObject';
      const user = { id: 1, name: 'John Doe' };

      localStorage.setItem(key, JSON.stringify(user));

      const result = getJSONItem<{ id: number; name: string }>(key);

      expect(result).toEqual(user);
    });

    it('should return null if the key does not exist', () => {
      expect(getJSONItem('nonExistentObject')).toBeNull();
    });

    it('should return null if the value is not a valid JSON string', () => {
      const key = 'invalidJson';
      const invalidJsonString = 'this is not json';

      localStorage.setItem(key, invalidJsonString);

      expect(getJSONItem(key)).toBeNull();
    });
  });
});