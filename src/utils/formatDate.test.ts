import {
  toISODate,
  minutesToHoursLabel,
  percent,
  formatDate,
  formatDateRangeByPattern,
  formatDateRangeByLocale,
} from './formatDate';

describe('Date and Number Utils', () => {
  describe('toISODate', () => {
    it('should convert a Date object to an ISO date string (YYYY-MM-DD)', () => {
      const date = new Date('2025-10-22T10:00:00Z');
      expect(toISODate(date)).toBe('2025-10-22');
    });

    it('should handle the end of the year correctly', () => {
      const date = new Date('2025-12-31T23:59:59Z');
      expect(toISODate(date)).toBe('2025-12-31');
    });
  });

  describe('minutesToHoursLabel', () => {
    it('should convert minutes to hours with default rounding', () => {
      expect(minutesToHoursLabel(120)).toBe('2h');
      expect(minutesToHoursLabel(90)).toBe('2h'); 
    });

    it('should convert minutes to hours with specified fraction digits', () => {
      expect(minutesToHoursLabel(90, 1)).toBe('1.5h');
      expect(minutesToHoursLabel(125, 2)).toBe('2.08h');
    });

    it('should handle zero minutes', () => {
      expect(minutesToHoursLabel(0)).toBe('0h');
    });

    it('should treat null or undefined input as 0', () => {
      expect(minutesToHoursLabel(null as any)).toBe('0h');
      expect(minutesToHoursLabel(undefined as any)).toBe('0h');
    });
  });

  describe('percent', () => {
    it('should calculate the correct percentage', () => {
      expect(percent(200, 50)).toBe(25);
    });

    it('should round the result to the nearest integer', () => {
      expect(percent(3, 1)).toBe(33); 
    });

    it('should return 0 if the total is 0 to prevent division by zero', () => {
      expect(percent(0, 100)).toBe(0);
    });

    it('should return 0 if the part is 0', () => {
      expect(percent(100, 0)).toBe(0);
    });

    it('should handle cases where part is greater than total', () => {
      expect(percent(50, 100)).toBe(200);
    });
  });

  describe('formatDate', () => {
    const date = new Date(2025, 9, 22); 
    const dateString = '2025-10-22';
    const timestamp = date.getTime();

    it('should format a Date object with default locale (en-GB)', () => {
      expect(formatDate(date)).toBe('22/10/2025');
    });

    it('should format a date string', () => {
      expect(formatDate(dateString)).toBe('22/10/2025');
    });

    it('should format a timestamp number', () => {
      expect(formatDate(timestamp)).toBe('22/10/2025');
    });

    it('should format a date with a specified locale (vi-VN)', () => {
      expect(formatDate(date, 'vi-VN')).toBe('22/10/2025');
    });

    it('should format a date with a specified locale (en-US)', () => {
      expect(formatDate(date, 'en-US')).toBe('10/22/2025');
    });
  });

  describe('formatDateRangeByPattern', () => {
    const start = new Date(2025, 9, 22);
    const end = '2025-10-28';

    it('should format a date range with the default pattern (yyyy-MM-dd)', () => {
      const expected = '2025-10-22 - 2025-10-28';
      expect(formatDateRangeByPattern(start, end)).toBe(expected);
    });

    it('should format a date range with a custom pattern (dd/MM/yyyy)', () => {
      const expected = '22/10/2025 - 28/10/2025';
      expect(formatDateRangeByPattern(start, end, 'dd/MM/yyyy')).toBe(expected);
    });
  });

  describe('formatDateRangeByLocale', () => {
    const start = '2025-10-22';
    const end = new Date(2025, 9, 28);

    it('should format a date range with the default locale (en-GB)', () => {
      const expected = '22/10/2025 - 28/10/2025';
      expect(formatDateRangeByLocale(start, end)).toBe(expected);
    });

    it('should format a date range with a custom locale (en-US)', () => {
      const expected = '10/22/2025 - 10/28/2025';
      expect(formatDateRangeByLocale(start, end, 'en-US')).toBe(expected);
    });
  });
});