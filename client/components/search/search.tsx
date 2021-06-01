import { useState, useEffect } from 'react';

interface SearchProps {
  onSearchChange: (searchTxt: string) => void;
}

function Search({ onSearchChange }: SearchProps) {
  const [searchTxt, setSearchTxt] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchTxt);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTxt]);

  return (
    <input
      type='search'
      className='form-control'
      placeholder='Search...'
      aria-label='Search'
      value={searchTxt}
      onChange={({ target }) => setSearchTxt(target.value)}
    />
  );
}

export default Search;
