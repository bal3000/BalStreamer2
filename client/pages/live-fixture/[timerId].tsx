import { GetServerSideProps } from 'next';
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
  return <div></div>;
}
