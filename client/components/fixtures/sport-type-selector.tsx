import { SportType } from '../../models/sport-type.enum';

interface SportTypeSelectorProps {
  sportType: SportType;
  onSelect: (sportType: SportType) => void;
}

function SportTypeSelector({ sportType, onSelect }: SportTypeSelectorProps) {
  return (
    <div className='p-5 mb-4 bg-light rounded-3'>
      <div className='container-fluid py-5'>
        <h1 className='display-5 fw-bold'>{sportType.toString()} fixtures</h1>
        <div className='row align-items-md-stretch'>
          <button
            className='col-md-2 m-2 p-2 btn btn-primary btn-lg'
            disabled={sportType === SportType.All}
            type='button'
            onClick={() => onSelect(SportType.All)}
          >
            All
          </button>
          <button
            className='col-md-2 m-2 p-2 btn btn-primary btn-lg'
            disabled={sportType === SportType.Soccer}
            type='button'
            onClick={() => onSelect(SportType.Soccer)}
          >
            Football
          </button>
          <button
            className='col-md-2 m-2 p-2 btn btn-primary btn-lg'
            disabled={sportType === SportType.Cricket}
            type='button'
            onClick={() => onSelect(SportType.Cricket)}
          >
            Cricket
          </button>
          <button
            className='col-md-2 m-2 p-2btn btn-primary btn-lg'
            disabled={sportType === SportType.Basketball}
            type='button'
            onClick={() => onSelect(SportType.Basketball)}
          >
            Basketball
          </button>
        </div>
      </div>
    </div>
  );
}

export default SportTypeSelector;
