interface StreamDetailsProps {
  rmtp: string;
  hls: string;
  dash: string;
  selectedChromecast: string | null | undefined;
  cast: () => void;
}

function StreamDetails(props: StreamDetailsProps) {
  return (
    <div className='row row-cols-1 row-cols-md-3 mb-3 text-center'>
      {props.rmtp && (
        <div className='col'>
          <div className='card mb-4 rounded-3 shadow-sm border-primary'>
            <div className='card-header py-3 text-white bg-primary border-primary'>
              <h4 className='my-0 fw-normal'>RMTP</h4>
            </div>
            <div className='card-body'>
              <button
                type='button'
                className='w-100 btn btn-lg btn-outline-primary'
                disabled={!props.selectedChromecast}
                onClick={() => props.cast()}
              >
                Cast
              </button>
            </div>
          </div>
        </div>
      )}
      {props.dash && (
        <div className='col'>
          <div className='card mb-4 rounded-3 shadow-sm'>
            <div className='card-header py-3'>
              <h4 className='my-0 fw-normal'>Dash</h4>
            </div>
            <div className='card-body'>
              <h3 className='card-title pricing-card-title'>
                TODO: play in player below
              </h3>

              <button type='button' className='w-100 btn btn-lg btn-primary'>
                Play
              </button>
            </div>
          </div>
        </div>
      )}
      {props.hls && (
        <div className='col'>
          <div className='card mb-4 rounded-3 shadow-sm'>
            <div className='card-header py-3'>
              <h4 className='my-0 fw-normal'>HLS</h4>
            </div>
            <div className='card-body'>
              <h3 className='card-title pricing-card-title'>
                TODO: play in player below
              </h3>
              <button type='button' className='w-100 btn btn-lg btn-primary'>
                Play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StreamDetails;
