import axios from 'axios';

import { Fixture } from './fixture';

let matchToPlay: Fixture | null = null;
let playingStream: boolean;

export function runAutoPlayer() {
  console.log(`Starting stream search - ${new Date().toString()}`);
  (async function loop() {
    if (matchToPlay === null) {
      const found = await noMatchToPlay();
      if (!found) {
        return setTimeout(loop, 24 * 60 * 60 * 1000);
      }
      return setTimeout(loop, 1000);
    }

    if (
      !playingStream &&
      new Date() >= matchToPlay.utcStart &&
      new Date() <= matchToPlay.utcEnd
    ) {
      await streamMatch();
      return setTimeout(loop, 1000);
    }

    // Run every 5 mins until match starts
    setTimeout(loop, 5 * 60 * 1000);
  })();
}

async function noMatchToPlay(): Promise<boolean> {
  console.log('No match to play so looking for fixtures');

  const fixture = await getFixtures();
  if (!fixture) {
    console.log('No match found so waiting 24hrs to try again');
    return false;
  }

  matchToPlay = fixture;
  return true;
}

async function streamMatch() {
  console.log('Match should have started so get streams');
}

async function getFixtures(): Promise<Fixture | null> {
  const { data: fixtures } = await axios.get<Fixture[]>(
    `http://localhost:8080/api/livestreams/soccer/${new Date().toUTCString()}/${new Date().toUTCString()}`
  );

  if (!fixtures || fixtures.length === 0) {
    return null;
  }

  // store these somewhere and have them changable via the express api
  const team = 'Liverpool';
  const country = 'England';

  let wantedMatch = fixtures.filter(
    (fixture) =>
      fixture.title.includes(team) && fixture.broadcastNationName === country
  );
  if (wantedMatch.length === 0) {
    wantedMatch = fixtures.filter((fixture) => fixture.title.includes(team));
  }

  if (wantedMatch.length === 0) {
    return null;
  }

  return wantedMatch[0];
}
