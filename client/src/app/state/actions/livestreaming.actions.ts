import { LiveFixture } from '../../models/live-fixture';
import { SportType } from '../../models/sport-type.enum';

export class PopulateFixtures {
  static readonly type = '[LiveStreaming] Populate Fixtures';
  constructor(
    public sportType: SportType,
    public fromDate: Date,
    public toDate: Date
  ) {}
}

export class SelectFixture {
  static readonly type = '[LiveStreaming] Select Fixture';
  constructor(public fixture: LiveFixture) {}
}
