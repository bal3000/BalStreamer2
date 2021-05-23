import Link from 'next/link';

import { LiveFixture } from '../../models/live-fixture';

interface FixtureOverviewProps {
  fixture: LiveFixture;
}

function FixtureOverview({ fixture }: FixtureOverviewProps) {
  return (
    <div className='card mb-4 shadow-sm'>
      <div className='card-header'>
        <h4 className='my-0 font-weight-normal'>{fixture.title}</h4>
      </div>
      <div className='card-body'>
        <h1 className='card-title pricing-card-title'>
          {fixture.contentTypeName}
        </h1>
        <ul className='list-unstyled mt-3 mb-4'>
          <li>{fixture.broadcastChannelName}</li>
          <li>{fixture.broadcastNationName}</li>
          <li>{fixture.utcStart}</li>
          <li>{fixture.utcEnd}</li>
        </ul>
        <Link href={`/live-fixture/${fixture.timerId}`}>
          <a className='btn btn-lg btn-block btn-primary'>Show</a>
        </Link>
      </div>
    </div>
  );
}

export default FixtureOverview;
