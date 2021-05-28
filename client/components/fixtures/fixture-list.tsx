import { LiveFixture } from '../../models/live-fixture';
import FixtureOverview from './fixture-overview';

interface FixtureListProps {
  fixtures: LiveFixture[];
}

function FixtureList({ fixtures }: FixtureListProps) {
  return (
    <div className='row align-items-md-stretch'>
      {fixtures.map((fix, index) => (
        <FixtureOverview key={fix.timerId} fixture={fix} index={index + 1} />
      ))}
    </div>
  );
}

export default FixtureList;
