import axios from 'axios';

import { Fixture } from './fixture';

export class AutoPlayer {
  #matchToPlay: Fixture | null = null;
  #playingStream: boolean = false;
  team: string = '';
  country: string = '';

  setTeam(team: string) {
    this.team = team;
    return this;
  }

  setCountry(country: string) {
    this.country = country;
    return this;
  }

  invoke() {
    console.log(`Starting stream search - ${new Date().toString()}`);
    const loop = async () => {
      if (this.#matchToPlay === null) {
        const found = await this.noMatchToPlay();
        if (!found) {
          return setTimeout(loop, 24 * 60 * 60 * 1000);
        }
        return setTimeout(loop, 1000);
      }

      if (
        !this.#playingStream &&
        new Date() >= this.#matchToPlay.utcStart &&
        new Date() <= this.#matchToPlay.utcEnd
      ) {
        await this.streamMatch();
        return setTimeout(loop, 1000);
      }

      // Run every 5 mins until match starts
      setTimeout(loop, 5 * 60 * 1000);
    };
    loop();
  }

  private async noMatchToPlay(): Promise<boolean> {
    console.log('No match to play so looking for fixtures');

    const fixture = await this.getFixtures();
    if (!fixture) {
      console.log('No match found so waiting 24hrs to try again');
      return false;
    }

    this.#matchToPlay = fixture;
    return true;
  }

  private async streamMatch() {
    console.log('Match should have started so get streams');
  }

  private async getFixtures(): Promise<Fixture | null> {
    const { data: fixtures } = await axios.get<Fixture[]>(
      `http://localhost:8080/api/livestreams/soccer/${new Date().toUTCString()}/${new Date().toUTCString()}`
    );

    if (!fixtures || fixtures.length === 0) {
      return null;
    }

    // store these somewhere and have them changable via the express api
    const team = this.team || 'Liverpool';
    const country = this.country || 'England';

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
}
