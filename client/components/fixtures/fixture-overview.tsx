import Link from 'next/link';

import { LiveFixture } from '../../models/live-fixture';

interface FixtureOverviewProps {
  index: number;
  fixture: LiveFixture;
}

function FixtureOverview({ fixture, index }: FixtureOverviewProps) {
  let containerClasses = 'h-100 p-5 text-white bg-dark rounded-3';
  let buttonClasses = 'btn btn-outline-light';
  if (index % 2 === 0) {
    containerClasses = 'h-100 p-5 bg-light border rounded-3';
    buttonClasses = 'btn btn-outline-secondary';
  }

  const formatDate = (date: string): string => {
    const formattedDate = new Date(date);
    return `${formattedDate.toLocaleDateString('en-UK', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    })} ${formattedDate.toLocaleTimeString('en-UK', {
      timeStyle: 'short',
    })}`;
  };

  return (
    <div className='col-md-6 p-2'>
      <div className={containerClasses}>
        <h2>{fixture.title}</h2>
        <p>{fixture.contentTypeName}</p>
        <ul className='list-unstyled mt-3 mb-4'>
          <li>{fixture.broadcastChannelName}</li>
          <li>{fixture.broadcastNationName}</li>
          <li suppressHydrationWarning>{formatDate(fixture.utcStart)}</li>
          <li suppressHydrationWarning>{formatDate(fixture.utcEnd)}</li>
        </ul>
        <Link href={`/live-fixture/${fixture.timerId}`}>
          <button className={buttonClasses} type='button'>
            Show
          </button>
        </Link>
      </div>
    </div>
  );
}

export default FixtureOverview;
