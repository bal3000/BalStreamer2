import { Selector } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

fixture('Now Playing')
  .page('http://localhost:3000/')
  .beforeEach(async () => {
    await waitForReact();
  });

test('Check currently playing div is not active', async (t) => {
  const nowplaying = Selector('#now-playing');

  await t.expect(nowplaying.exists).notOk('now playing should not exist');
});

test.page('http://localhost:3000/?ff=1')(
  'Check currently playing div is active with feature flag',
  async (t) => {
    const nowplaying = Selector('#now-playing');
    const stopButton = nowplaying.child('button#stop-playing');

    await t.expect(nowplaying.exists).ok('now playing should exist');
    await t.expect(stopButton.exists).ok('stop button should exist');
  }
);

test.page('http://localhost:3000/?ff=1')(
  'Check currently playing div is not active',
  async (t) => {
    const nowplaying = Selector('#now-playing');
    const stopButton = nowplaying.child('button#stop-playing');

    await t
      .click(stopButton)
      .expect(Selector('#now-playing').exists)
      .notOk('now playing should not exist after stop click');
  }
);
