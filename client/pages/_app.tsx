import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';

import { store } from '../state';
import Header from '../components/header/header';
import CurrentPlaying from '../components/chromecasts/current-playing';

import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <Provider store={store}>
        <Header />
        <main role='main'>
          <CurrentPlaying currentlyCasting={pageProps.currentlyPlaying} />
          <div className='container'>
            <Component {...pageProps} />
          </div>
        </main>
      </Provider>
      <script
        src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js'
        integrity='sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT'
        crossOrigin='anonymous'
      ></script>
    </>
  );
}

// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   let currentlyPlaying: CastedFixture[] = [];
//   try {
//     const { data } = await streamerApi.get<CastedFixture[]>(
//       '/api/currentplaying'
//     );
//     currentlyPlaying = data;
//   } catch (err) {
//     if (err.response && err.response.status === 404) {
//       currentlyPlaying = [];
//     } else {
//       console.log(err);
//     }
//   }

//   return { ...appProps, currentlyPlaying };
// };

export default MyApp;
