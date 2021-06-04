import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { CastedFixture } from '../../models/casted-fixture';
import streamerApi from '../../helpers/api-caller';

function CurrentPlaying() {
  const [hide, setHide] = useState<boolean>(false);
  const [currentlyCasting, setCurrentlyCasting] = useState<CastedFixture[]>([]);
  const router = useRouter();

  useEffect(() => {
    streamerApi
      .get<CastedFixture[]>('/api/currentplaying')
      .then(({ data }) => {
        setCurrentlyCasting(data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setCurrentlyCasting([]);
        }
        console.log(err);
      });
  }, []);

  const nowPlaying = (
    casting: CastedFixture[],
    onStop: (chromecast: string) => void
  ): JSX.Element | null => {
    if (hide) {
      return null;
    }

    console.log(casting);

    return (
      <div id='now-playing' className='px-4 py-5 my-5 text-center'>
        {casting.map((cast) => (
          <div key={cast.chromecast} className='col-lg-6 mx-auto'>
            <p className='lead mb-4'>
              Currently casting {cast.fixture} on chromecast {cast.chromecast}
            </p>
            <div className='d-grid gap-2 d-sm-flex justify-content-sm-center'>
              <button
                id='stop-playing'
                type='button'
                className='btn btn-danger btn-lg px-4 gap-3'
                onClick={() => onStop(cast.chromecast)}
              >
                Stop
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const { ff } = router.query;
  if (ff) {
    // feature flag
    return nowPlaying(
      [{ fixture: 'demo fixture', chromecast: 'demo chromecast' }],
      () => setHide(true)
    );
  }

  if (!currentlyCasting || currentlyCasting.length === 0) {
    return null;
  }

  return nowPlaying(currentlyCasting, (chromecast) =>
    streamerApi
      .delete('/api/cast', {
        data: {
          chromeCastToStop: chromecast,
          stopDateTime: new Date(),
        },
      })
      .then(() => {
        setCurrentlyCasting(
          currentlyCasting.filter((c) => c.chromecast !== chromecast)
        );
      })
  );
}

export default CurrentPlaying;
