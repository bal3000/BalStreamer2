import { GetServerSideProps } from 'next';

import streamerApi from '../helpers/api-caller';
import FixtureList from '../components/fixtures/fixture-list';
import { LiveFixture } from '../models/live-fixture';
import Hero from '../components/hero/hero';

interface HomeProps {
  fixtures: LiveFixture[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await streamerApi.get<LiveFixture[]>(
      `/api/livestreams/all/${today}/${today}/inplay`
    );

    if (response.status !== 200) {
      return {
        props: {
          fixtures: [],
        },
      };
    }

    return {
      props: {
        fixtures: response.data,
      },
    };
  } catch (err) {
    return {
      props: {
        fixtures: [],
      },
    };
  }
};

export default function Home({ fixtures }: HomeProps) {
  return (
    <>
      <Hero />
      <FixtureList fixtures={fixtures} />
    </>
  );
}
