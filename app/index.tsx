import { useEffect, useState } from "react";
import { Image,ScrollView, Text, View, StyleSheet } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types:PokemonType[];
}

//complex types can be defined using interfaces

interface PokemonType{
  type:{
    name:string;
    url:string;
  }
}

export default function Index() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  console.log(JSON.stringify(pokemons[2], null,2));
  useEffect(()=>{
    //fetch Pokemon data from pokeapi
    fetchPokemons();

  },[])

  async function fetchPokemons(){
    try{
      const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=20');
      const data = await response.json();
      console.log(data);

      //fetch detailed  info for each Pokemon in parallel
      //{"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"}

      const detailedPokemons= await Promise.all(
        data.results.map(async (pokemon:any)=>{
          const res = await fetch(pokemon.url);
          const details= await res.json();
          return{
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemons);
    }

    catch(e){
      console.log(e);
    }
  }

  return (
    <ScrollView>
      {pokemons.map((pokemon) => (
        <View key={pokemon.name}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text>{pokemon.types[0].type.name}</Text>
          <Text></Text>
          <View 
            style={{
              display: "flex",
              flexDirection: "row"}}>
              <Image source={{uri: pokemon.image}} alt={pokemon.name} 
              style={{width: 150, height: 150}}/>

              <Image source={{uri: pokemon.imageBack}} alt={pokemon.name} 
              style={{width: 150, height: 150}}/>
          </View>
        </View>
        ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name:{
    fontSize: 24,
    fontWeight: "bold",
  }
})
