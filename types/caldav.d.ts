declare module 'caldav' {
  interface CalDAVConfig {
    url: string;
    username: string;
    password: string;
  }

  interface CalendarEvent {
    uid: string;
    start: Date;
    end: Date;
    summary: string;
    description?: string;
  }

  class CalDAV {
    constructor(config: CalDAVConfig);
    getEvents(start: Date, end: Date): Promise<CalendarEvent[]>;
  }

  export default CalDAV;
} 