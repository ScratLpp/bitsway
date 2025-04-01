import {
  createUTCDate,
  localToUTC,
  isDateInInterval,
  formatDateForCalDAV,
  parseCalDAVDate,
  createTimeSlot,
  isSlotOverlapping,
  getUTCDayRange
} from '../dateHelpers';

describe('Date Helpers', () => {
  describe('createUTCDate', () => {
    it('should create a UTC date correctly', () => {
      const date = createUTCDate(2024, 3, 4, 13, 0, 0); // 4 avril 2024 13:00 UTC
      expect(date.toISOString()).toBe('2024-04-04T13:00:00.000Z');
    });
  });

  describe('localToUTC', () => {
    it('should convert local date to UTC correctly', () => {
      const localDate = new Date(2024, 3, 4, 13, 0, 0); // 4 avril 2024 13:00 local
      const utcDate = localToUTC(localDate);
      expect(utcDate.getTime()).toBe(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    });
  });

  describe('isDateInInterval', () => {
    it('should correctly identify if a date is within an interval', () => {
      const start = createUTCDate(2024, 3, 4, 9, 0, 0);
      const end = createUTCDate(2024, 3, 4, 18, 0, 0);
      const date = createUTCDate(2024, 3, 4, 13, 0, 0);
      
      expect(isDateInInterval(date, start, end)).toBe(true);
    });
  });

  describe('formatDateForCalDAV', () => {
    it('should format date correctly for CalDAV', () => {
      const date = createUTCDate(2024, 3, 4, 13, 0, 0);
      expect(formatDateForCalDAV(date)).toBe('20240404T130000Z');
    });
  });

  describe('parseCalDAVDate', () => {
    it('should parse UTC CalDAV date correctly', () => {
      const dateString = '20240404T130000Z';
      const date = parseCalDAVDate(dateString);
      expect(date.toISOString()).toBe('2024-04-04T13:00:00.000Z');
    });

    it('should parse local CalDAV date correctly', () => {
      const dateString = '20240404T130000';
      const date = parseCalDAVDate(dateString);
      const localDate = new Date(2024, 3, 4, 13, 0, 0);
      expect(date.getTime()).toBe(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    });
  });

  describe('createTimeSlot', () => {
    it('should create a time slot correctly', () => {
      const date = createUTCDate(2024, 3, 4);
      const slot = createTimeSlot(date, 13);
      
      expect(slot.start.toISOString()).toBe('2024-04-04T13:00:00.000Z');
      expect(slot.end.toISOString()).toBe('2024-04-04T14:00:00.000Z');
    });
  });

  describe('isSlotOverlapping', () => {
    it('should detect overlapping slots correctly', () => {
      const slot = {
        start: createUTCDate(2024, 3, 4, 13, 0, 0),
        end: createUTCDate(2024, 3, 4, 14, 0, 0)
      };
      
      const event = {
        start: createUTCDate(2024, 3, 4, 13, 30, 0),
        end: createUTCDate(2024, 3, 4, 14, 30, 0)
      };
      
      expect(isSlotOverlapping(slot, event)).toBe(true);
    });

    it('should detect non-overlapping slots correctly', () => {
      const slot = {
        start: createUTCDate(2024, 3, 4, 13, 0, 0),
        end: createUTCDate(2024, 3, 4, 14, 0, 0)
      };
      
      const event = {
        start: createUTCDate(2024, 3, 4, 14, 0, 0),
        end: createUTCDate(2024, 3, 4, 15, 0, 0)
      };
      
      expect(isSlotOverlapping(slot, event)).toBe(false);
    });
  });

  describe('getUTCDayRange', () => {
    it('should return correct UTC day range', () => {
      const date = createUTCDate(2024, 3, 4);
      const range = getUTCDayRange(date);
      
      expect(range.start.toISOString()).toBe('2024-04-04T00:00:00.000Z');
      expect(range.end.toISOString()).toBe('2024-04-04T23:59:59.000Z');
    });
  });
}); 