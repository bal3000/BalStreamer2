import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import axios from 'axios';

import { Streams } from '../../models/streams';

interface LiveFixtureDetailsProps {
  streams: Streams;
}

export const getServerSideProps: GetServerSideProps<LiveFixtureDetailsProps> =
  async ({ query }) => {
    const { data: streams } = await axios.get<Streams>(
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

  const castStream = async (streamUrl: string) => {
    await axios.post('/api/cast', {
      chromecast: 'STILL TO GET',
      streamURL: streamUrl,
    });

    router.push('/');
  };

  return <div></div>;
}
