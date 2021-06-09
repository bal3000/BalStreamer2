import { RabbitEvent } from './rabbit-event';

export class ScheduleEvent extends RabbitEvent {
  messageType: string;
  fixture: string;
  timerId: number;
  startDate: Date;
  endDate: Date;

  constructor() {
    super();
    this.messageType = '';
    this.fixture = '';
    this.timerId = 0;
    this.startDate = new Date();
    this.endDate = new Date();
  }
}
