// Cache resources
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView,
  PokemonErrorBoundary,
} from '../pokemon'
import {createResource} from '../utils'

function PokemonInfo({pokemonResource}) {
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

const SUSPENSE_CONFIG = {
  timeoutMs: 4000,
  busyDelayMs: 300,
  busyMinDurationMs: 700,
}

// Pokemon Resource Cache Context

const PokemonResourceCacheContext = React.createContext()

function createPokemonResource(pokemonName) {
  return createResource(fetchPokemon(pokemonName))
}

function PokemonCacheProvider(props) {
  const pokemonResourceCache = React.useRef({})

  function getPokemonResource(pokemonName) {
    let resource = pokemonResourceCache.current[pokemonName]
    const timeNow = new Date()
    const isOutdated =
      resource && props.cacheTime && timeNow - resource.time > props.cacheTime

      console.log(isOutdated)
    if (!resource || isOutdated) {
      resource = {
        pokemonResource: createPokemonResource(pokemonName),
        time: new Date(),
      }
      pokemonResourceCache.current[pokemonName] = resource
    }
    return resource.pokemonResource
  }

  const value = React.useCallback(getPokemonResource, [props])

  return <PokemonResourceCacheContext.Provider value={value} {...props} />
}

function usePokemonResourceContextCache() {
  const context = React.useContext(PokemonResourceCacheContext)
  if (!context) {
    throw new Error(
      'usePokemonResourceContextCache must be used within a PokemonCacheProvider',
    )
  }
  return context
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')
  const [startTransition, isPending] = React.useTransition(SUSPENSE_CONFIG)
  const [pokemonResource, setPokemonResource] = React.useState(null)

  const getPokemonResource = usePokemonResourceContextCache()

  React.useEffect(() => {
    if (!pokemonName) {
      setPokemonResource(null)
      return
    }
    startTransition(() => {
      setPokemonResource(getPokemonResource(pokemonName))
    })
  }, [pokemonName, startTransition, getPokemonResource])

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className={`pokemon-info ${isPending ? 'pokemon-loading' : ''}`}>
        {pokemonResource ? (
          <PokemonErrorBoundary
            onReset={handleReset}
            resetKeys={[pokemonResource]}
          >
            <React.Suspense
              fallback={<PokemonInfoFallback name={pokemonName} />}
            >
              <PokemonInfo pokemonResource={pokemonResource} />
            </React.Suspense>
          </PokemonErrorBoundary>
        ) : (
          'Submit a pokemon'
        )}
      </div>
    </div>
  )
}

function AppWithProvider() {
  return (
    <PokemonCacheProvider cacheTime="5000">
      <App />
    </PokemonCacheProvider>
  )
}

export default AppWithProvider
