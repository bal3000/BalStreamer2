import { useEffect } from 'react';
import Link from 'next/link';

import { useActions, useTypedSelector } from '../../hooks';
import Chromecasts from '../chromecasts/chromecasts';

function Header() {
  const { fetchChromecasts, selectChromecast } = useActions();
  const chromcastState = useTypedSelector(({ chromecasts }) => chromecasts);

  useEffect(() => {
    fetchChromecasts();
  }, []);

  const selectedChromecast = (chromecast: string) => {
    if (chromecast !== chromcastState?.selectedChromecast) {
      selectChromecast(chromecast);
    }
  };

  return (
    <>
      <header>
        <div className='collapse bg-dark' id='navbarHeader'>
          <div className='container'>
            <div className='row'>
              <div className='col-sm-8 col-md-7 py-4'>
                <h4 className='text-white'>Chromecasts</h4>
                <p className='text-muted'>
                  Found chromecasts are listed to the side
                </p>
              </div>
              <div className='col-sm-4 offset-md-1 py-4 text-white'>
                <Chromecasts
                  chromecasts={chromcastState?.chromecasts}
                  loading={chromcastState?.loading}
                  error={chromcastState?.error}
                  selectedChromecast={chromcastState?.selectedChromecast}
                  onSelect={selectedChromecast}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='navbar navbar-dark bg-dark shadow-sm'>
          <div className='d-flex flex-row mb-3 container'>
            <div className='navbar-brand d-flex align-items-center'>
              <Link href='/'>
                <a className='navbar-brand d-flex align-items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1'
                    aria-hidden='true'
                    className='bi bi-house'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z'
                    />
                    <path
                      fillRule='evenodd'
                      d='M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z'
                    />
                  </svg>
                  <span>Home</span>
                </a>
              </Link>
              <Link href='/live-fixtures'>
                <a className='navbar-brand d-flex align-items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='bi bi-camera-video-fill'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fillRule='evenodd'
                      d='M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5z'
                    />
                  </svg>
                  <span>Live Matches</span>
                </a>
              </Link>
            </div>
            <button
              className='navbar-toggler'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#navbarHeader'
              aria-controls='navbarHeader'
              aria-expanded='false'
              aria-label='Toggle navigation'
            >
              <span className='navbar-toggler-icon'></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
