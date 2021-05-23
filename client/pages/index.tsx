import { GetServerSideProps } from 'next';
import axios from 'axios';

import FixtureList from '../components/fixtures/fixture-list';
import { LiveFixture } from '../models/live-fixture';

interface HomeProps {
  fixtures: LiveFixture[];
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const today = new Date().toISOString().split('T')[0];
  const response = await axios.get<LiveFixture[]>(
    `/api/livestreams/soccer/${today}/${today}`
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
};

export default function Home({ fixtures }: HomeProps) {
  return (
    <main role='main'>
      <div className='container'>
        <FixtureList fixtures={fixtures} />
      </div>
    </main>
  );
}
