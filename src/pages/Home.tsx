import { useEffect, useState } from 'react'
import '../global.css'

type PokemonData = {
  name: string
  image: string
}

type PokeApiResponse = {
  name: string
  sprites: {
    front_default: string
  }
  url: string
}

function Home() {
  const [pokemons, setPokemons] = useState<PokemonData[]>([])
  const [searchInput, setSearchInput] = useState<string>("")
  const [onLoading, setOnLoading] = useState<boolean>(true)

  const searchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(currInputValue => event.target.value)
  }

  const boxMouseOverHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.backgroundColor = "lightblue";
  };

  const boxMouseOutHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const box: HTMLDivElement = event.currentTarget;
    box.style.backgroundColor = "green";
  };

  useEffect(() => {
    const fetchData = async () => {
      let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
      let data = await response.json()
      for (let i = 0; i < data.results.length; i++) {
        let response2 = await fetch(data.results[i].url)
        let data2: PokeApiResponse = await response2.json()
        setPokemons(currPokemons => currPokemons.concat({ name: data2.name, image: data2.sprites.front_default }))
      }
      setOnLoading(false)
    }
    fetchData()
  }, [])

  return (
    <>
      <header className='header'>
        <nav className='nav'>
          <input
            className='search-input'
            placeholder='Search...'
            type="text"
            onChange={searchInputChange}
            value={searchInput} />
        </nav>
      </header>
      <div className='container'>
        <main className='main'>
          {
            onLoading
              ?
              <div>Carregando</div>
              :
              pokemons
                .filter(item => {
                  if (searchInput !== '') return item.name.includes(searchInput)
                  else return item
                })
                .map((item, index) =>
                  <div
                    key={index}
                    className='card'
                    onMouseOver={boxMouseOverHandler}
                    onMouseOut={boxMouseOutHandler}
                  >
                    <img src={item.image} alt={`Imagem do ${item.name}`} />
                    <p>{item.name}</p>
                  </div>
                )
          }
        </main>
      </div>
    </>
  )
}

export default Home
