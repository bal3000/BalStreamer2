import Link from 'next/link';

import Chromecasts from '../chromecasts/chromecasts';

function Hero() {
  return (
    <div className='p-5 mb-4 bg-light rounded-3'>
      <div className='container-fluid py-5'>
        <h1 className='display-5 fw-bold'>Bal Streamer V2</h1>
        <p className='col-md-8 fs-4'>
          Please select a chromecast below or in the top nav, before selecting a
          stream
        </p>
        <Chromecasts />
        <Link href='/live-fixtures'>
          <button className='btn btn-primary btn-lg' type='button'>
            Show all fixtures
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
