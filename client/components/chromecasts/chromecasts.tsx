import { useTypedSelector } from '../../hooks';

function Chromecasts() {
  const chromecasts = useTypedSelector(
    ({ chromecasts }) => chromecasts?.chromecasts
  );

  if (!chromecasts) {
    return <div></div>;
  }

  return (
    <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5'>
      {chromecasts.map((chromecast) => (
        <div className='col d-flex align-items-start'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            fill='currentColor'
            className='bi bi-cast'
            viewBox='0 0 16 16'
          >
            <path d='m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z' />
            <path d='M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z' />
          </svg>
          <div>
            <h4 className='fw-bold mb-0'>{chromecast.chromecast}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Chromecasts;
