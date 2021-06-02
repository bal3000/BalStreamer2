import { useState } from 'react';
import { useRouter } from 'next/router';

import { useActions, useTypedSelector } from '../../hooks';

interface CurrentPlayingProps {}

function CurrentPlaying() {
  const [hide, setHide] = useState<boolean>(false);
  const router = useRouter();
  const { stoppedCasting } = useActions();
  const currentlyCasting = useTypedSelector(
    ({ chromecasts }) => chromecasts?.currentlyCasting
  );

  const nowPlaying = (
    fixture: string,
    chromecast: string,
    onStop: () => void
  ): JSX.Element | null => {
    if (hide) {
      return null;
    }

    return (
      <div id='now-playing' className='px-4 py-5 my-5 text-center'>
        <div className='col-lg-6 mx-auto'>
          <p className='lead mb-4'>
            Currently casting {fixture} on chromecast {chromecast}
          </p>
          <div className='d-grid gap-2 d-sm-flex justify-content-sm-center'>
            <button
              id='stop-playing'
              type='button'
              className='btn btn-danger btn-lg px-4 gap-3'
              onClick={() => onStop()}
            >
              Stop
            </button>
          </div>
        </div>
      </div>
    );
  };

  const { ff } = router.query;
  if (ff) {
    // feature flag
    return nowPlaying('demo fixture', 'demo chromecast', () => setHide(true));
  }

  if (!currentlyCasting) {
    return null;
  }

  return nowPlaying(currentlyCasting.fixture, currentlyCasting.chromecast, () =>
    stoppedCasting()
  );
}

export default CurrentPlaying;
