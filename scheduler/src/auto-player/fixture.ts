export interface Fixture {
  stateName: string;
  utcStart: Date;
  utcEnd: Date;
  title: string;
  eventId: string;
  contentTypeName: string;
  timerId: number;
  isPrimary: boolean;
  broadcastChannelName: string;
  broadcastNationName: string;
  sourceTypeName: string;
}
