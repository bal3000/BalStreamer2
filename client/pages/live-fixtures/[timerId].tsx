import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { useTypedSelector, useActions } from '../../hooks';
import StreamOverview from '../../components/streams/stream-overview';
import StreamDetails from '../../components/streams/stream-details';
import streamerApi from '../../helpers/api-caller';
import { Streams } from '../../models/streams';
import { LiveFixture } from '../../models/live-fixture';
import { SportType } from '../../models/sport-type.enum';

interface LiveFixtureDetailsProps {
  streams: Streams;
  currentFixture: LiveFixture;
}

export const getServerSideProps: GetServerSideProps<LiveFixtureDetailsProps> =
  async ({ query }) => {
    const today = new Date().toISOString().split('T')[0];
    const { data: streams } = await streamerApi.get<Streams>(
      `/api/livestreams/${query.timerId}`
    );
    const { data: fixtures } = await streamerApi.get<LiveFixture[]>(
      `/api/livestreams/${SportType.All}/${today}/${today}`
    );

    const currentFixture = fixtures.find(
      (f) => f.timerId === query.timerId && f.isPrimary === 'true'
    );

    if (!currentFixture) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        streams,
        currentFixture,
      },
    };
  };

export default function LiveFixtureDetails({
  streams,
  currentFixture,
}: LiveFixtureDetailsProps) {
  const router = useRouter();
  const fixture = useTypedSelector(({ fixture }) => fixture?.selectedFixture);
  const selectedChromecast = useTypedSelector(
    ({ chromecasts }) => chromecasts?.selectedChromecast
  );
  const { selectFixture, nowCasting } = useActions();

  if (!fixture && currentFixture) {
    selectFixture(currentFixture);
  }

  const castStream = async () => {
    await streamerApi.post('/api/cast', {
      chromecast: selectedChromecast,
      fixture: `${fixture?.title} - ${fixture?.broadcastChannelName}`,
      streamURL: streams.rtmp,
    });

    nowCasting({
      fixture: `${fixture?.title} - ${fixture?.broadcastChannelName}`,
      chromecast: selectedChromecast!,
    });

    router.push('/');
  };

  return (
    <>
      {fixture && <StreamOverview fixture={fixture} />}
      <StreamDetails
        cast={() => castStream()}
        rmtp={streams.rtmp}
        hls={streams.hls}
        dash={streams.dash}
        selectedChromecast={selectedChromecast}
      />
    </>
  );
}
