import React, { useState, useEffect } from 'react';

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const randomIds = Array.from({ length: 15 }, () => Math.floor(Math.random() * 898) + 1);
        const pokemonDetails = await Promise.all(
          randomIds.map(async (id) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return res.json();
          })
        );
        setPokemons(pokemonDetails);
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
      }
    };

    fetchPokemons();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      const data = await response.json();
      setSearchResult(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
      setSearchResult(null);
      setErrorMessage('Pokémon not found');
      setTimeout(() => {
        setErrorMessage('');
      }, 4000);
    }
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleBackClick = () => {
    setSelectedPokemon(null);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="container mx-auto p-4 relative">
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-3xl font-bold text-black bg-white p-4 rounded shadow">
            {errorMessage}
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Pokémon"
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
      </form>
      {selectedPokemon ? (
        <div className="pokemon-detail border p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">{capitalizeFirstLetter(selectedPokemon.name)}</h2>
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} className="mb-2" />
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>
          <p>Type: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
          <p>Base Experience: {selectedPokemon.base_experience}</p>
          <p>Abilities: {selectedPokemon.abilities.map((ability) => ability.ability.name).join(', ')}</p>
          <p>Stats:</p>
          <ul>
            {selectedPokemon.stats.map((stat) => (
              <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
            ))}
          </ul>
          <button onClick={handleBackClick} className="bg-red-500 text-white p-2 rounded mb-4">Back</button>
          {/* <button onClick={() => addToRoaster(selectedPokemon)} className="bg-green-500 text-white p-2 rounded mt-4">Add to Roaster</button> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResult ? (
            <div className="pokemon-card border p-4 rounded shadow" onClick={() => handlePokemonClick(searchResult)}>
              <h2 className="text-xl font-bold mb-2">{searchResult.name}</h2>
              <img src={searchResult.sprites.front_default} alt={searchResult.name} className="mb-2" />
              <p>HP: {searchResult.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
              <p>Attack: {searchResult.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
              <p>Type: {searchResult.types.map((type) => type.type.name).join(', ')}</p>
            </div>
          ) : (
            pokemons.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-card border p-4 rounded shadow" onClick={() => handlePokemonClick(pokemon)}>
                <h2 className="text-xl font-bold mb-2">{capitalizeFirstLetter(pokemon.name)}</h2>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mb-2" />
                <p>HP: {pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat}</p>
                <p>Attack: {pokemon.stats.find(stat => stat.stat.name === 'attack').base_stat}</p>
                <p>Type: {pokemon.types.map((type) => type.type.name).join(', ')}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;