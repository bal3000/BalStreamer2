import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';

import streamerApi from '../../helpers/api-caller';
import { LiveFixture } from '../../models/live-fixture';
import { SportType } from '../../models/sport-type.enum';
import FixtureList from '../../components/fixtures/fixture-list';
import SportTypeSelector from '../../components/fixtures/sport-type-selector';

interface LiveFixturesPageProps {
  fixtures: LiveFixture[];
}

const livestreamApi = async (sportType: SportType): Promise<LiveFixture[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await streamerApi.get<LiveFixture[]>(
      `/api/livestreams/${sportType}/${today}/${today}`
    );

    if (response.status !== 200) {
      return [];
    }
    return response.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getServerSideProps: GetServerSideProps<LiveFixturesPageProps> =
  async () => {
    const sportType: SportType = SportType.All;
    // if (params && params['filter']) {
    //   const filter = params['filter'];
    //   const converted = filter[0] as SportType;
    //   if (converted) {
    //     sportType = converted;
    //   }
    // }

    const fixtures = await livestreamApi(sportType);

    return {
      props: {
        fixtures,
      },
    };
  };

export default function LiveFixturesPage({ fixtures }: LiveFixturesPageProps) {
  const [sportFixtures, setSportFixtures] = useState<LiveFixture[]>(fixtures);
  const [sportType, setSportType] = useState<SportType>(SportType.All);

  useEffect(() => {
    livestreamApi(sportType).then((response) => setSportFixtures(response));
  }, [sportType]);

  return (
    <>
      <SportTypeSelector
        sportType={sportType}
        onSelect={(st) => setSportType(st)}
      />
      <FixtureList fixtures={sportFixtures} />
    </>
  );
}
