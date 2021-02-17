// Simple Data-fetching
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'
import {createResource} from '../utils'
import {
  PokemonDataView,
  fetchPokemon,
  PokemonErrorBoundary,
  PokemonInfoFallback,
} from '../pokemon'

// function createResource(someAsyncThing) {
//   let status = 'pending'
//   let result = someAsyncThing.then(
//     resolvedData => {
//       status = 'resolved'
//       result = resolvedData
//     },
//     errorData => {
//       status = 'rejected'
//       result = errorData
//     },
//   )

//   return {
//     read() {
//       if (status === 'pending') throw result
//       if (status === 'rejected') throw result
//       if (status === 'resolved') return result
//     },
//   }
// }

const pokemonResource = createResource(fetchPokemon('pikachu'))

function PokemonInfo() {
  const pokemon = pokemonResource.read()

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
          <React.Suspense fallback={<PokemonInfoFallback name='Pikachu' />}>
            <PokemonInfo />
          </React.Suspense>
        </div>
      </PokemonErrorBoundary>
    </div>
  )
}

export default App
