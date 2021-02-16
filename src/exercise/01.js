// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {PokemonDataView, fetchPokemon, PokemonErrorBoundary} from '../pokemon'

// let pokemon
// let pokemonError

// const pokemonPromise = fetchPokemon('pikacha').then(
//   resolvedData => (pokemon = resolvedData),
//   errorData => (pokemonError = errorData),
// )

function createResource(someAsyncThing) {
  let data
  let error
 
  const resourcePromise = someAsyncThing.then(
    resolvedData => (data = resolvedData),
    errorData => (error = errorData),
  )
  
  function read() {
    if (error) {
      throw error
    }
    if (!data) {
      throw resourcePromise
    }
    return data
  }
  return {read}
}

const resource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {

  const pokemon = resource.read()

  console.log(pokemon)

  // if (pokemonError) {
  //   console.log('error en PokemonInfo')
  //   throw pokemonError
  // }
  // if (!pokemon) {
  //   throw pokemonPromise
  // }

  return (
    <div>
      <div className="pokemon-info__img-wrapper">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>
      <PokemonDataView pokemon={pokemon} />
    </div>
  )
}

function App() {
  return (
    <div className="pokemon-info-app">
      <PokemonErrorBoundary>
        <div className="pokemon-info">
          <React.Suspense fallback={<div>Loading...</div>}>
            <PokemonInfo />
          </React.Suspense>
        </div>
      </PokemonErrorBoundary>
    </div>
  )
}

export default App
