import { LiveFixture } from '../../models/live-fixture';
import FixtureOverview from './fixture-overview';

interface FixtureListProps {
  fixtures: LiveFixture[];
}

function FixtureList({ fixtures }: FixtureListProps) {
  return (
    <div className={'card-deck mb-3 text-center'}>
      {fixtures.map((fix) => (
        <FixtureOverview key={fix.timerId} fixture={fix} />
      ))}
    </div>
  );
}

export default FixtureList;
