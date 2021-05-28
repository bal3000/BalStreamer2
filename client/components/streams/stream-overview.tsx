import { LiveFixture } from '../../models/live-fixture';

interface StreamOverviewProps {
  fixture: LiveFixture;
}

function StreamOverview({ fixture }: StreamOverviewProps) {
  return (
    <div className='p-5 mb-4 bg-light rounded-3'>
      <div className='container-fluid py-5'>
        <h1 className='display-5 fw-bold'>{fixture.title}</h1>
        <h2>{fixture.contentTypeName}</h2>
        <p className='col-md-8 fs-4'>
          {fixture.broadcastChannelName} - {fixture.broadcastNationName}
        </p>
        <p className='col-md-8 fs-4'>Is Primary: {fixture.isPrimary}</p>
      </div>
    </div>
  );
}

export default StreamOverview;
