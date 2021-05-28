import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { useTypedSelector } from '../../hooks';
import StreamOverview from '../../components/streams/stream-overview';
import StreamDetails from '../../components/streams/stream-details';
import streamerApi from '../../helpers/api-caller';
import { Streams } from '../../models/streams';

interface LiveFixtureDetailsProps {
  streams: Streams;
}

export const getServerSideProps: GetServerSideProps<LiveFixtureDetailsProps> =
  async ({ query }) => {
    const { data: streams } = await streamerApi.get<Streams>(
      `/api/livestreams/${query.timerId}`
    );

    return {
      props: {
        streams,
      },
    };
  };

export default function LiveFixtureDetails({
  streams,
}: LiveFixtureDetailsProps) {
  const router = useRouter();
  const fixture = useTypedSelector(({ fixture }) => fixture?.selectedFixture);

  // TODO:  if null e.g. direct link, call api and re fetch data and set the selected fixture
  if (!fixture) {
  }

  const castStream = async () => {
    await streamerApi.post('/api/cast', {
      chromecast: 'STILL TO GET',
      streamURL: streams.rtmp,
    });

    router.push('/');
  };

  return (
    <>
      {fixture && <StreamOverview fixture={fixture} />}
      <StreamDetails cast={() => castStream()} />
    </>
  );
}
