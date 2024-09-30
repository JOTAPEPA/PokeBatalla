<template>
  <div class="container">
    <div class="title">
      <h1>Batallas Pokemon</h1>
    </div>
    <div v-if="mostrarRondas" class="escogerRondas">
      <h4>¿Cuantas Rondas desea jugar?</h4>
      <q-btn color="white" text-color="black" label="3 Rondas" class="btnRondas" @click="escogerRondas(3)" />
      <q-btn color="white" text-color="black" label="5 Rondas" class="btnRondas" @click="escogerRondas(5)" />
      <q-btn color="white" text-color="black" label="7 Rondas" class="btnRondas" @click="escogerRondas(7)" />
    </div>
    <div v-else class="contenidoBatalla">
      <div class="column" id="jugador1">
        <h4>Jugador 1</h4>
      </div>
      <div class="column" id="lucha">
        <h4>lucha</h4>
      </div>
      <div class="column" id="jugador2">
        <h4>Jugador 2</h4>
      </div>
    </div>
    <div class="escogerPokemon">
      <q-btn label="Lucha" color="primary" @click="prompt = true" />
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Digite un numero para escoger su pokemon</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="pokemonNumber" autofocus @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add address" v-close-popup @click="listarPokemones(pokemonNumber)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>

</template>


<script setup>
import axios from "axios"
import { ref } from 'vue';

let prompt = ref(false);
let pokemonNumber = ref('');

const mostrarRondas = ref(true);

function escogerRondas(rondas) {
  console.log(`Rondas escogidas: ${rondas}`);
  mostrarRondas.value = false;
}

function getRandomPokemonId() {
  return Math.floor(Math.random() * 898) + 1;
}

async function listarPokemones() {
  let id1 = getRandomPokemonId();
  let id2 = getRandomPokemonId();
  while (id1 === id2) {
    id2 = getRandomPokemonId();
  }
  let url1 = `https://pokeapi.co/api/v2/pokemon/${id1}`;
  let url2 = `https://pokeapi.co/api/v2/pokemon/${id2}`;
  try {
    let [response1, response2] = await Promise.all([axios.get(url1), axios.get(url2)]);
    console.log('Pokemon 1:', response1.data);
    console.log('Pokemon 2:', response2.data);
  } catch (error) {
    console.log(error)
  }
}

</script>

<style>
* {
  margin: 0;
}

body {
  font-family: 'Arial';
}

.container {
  position: relative;
  height: 100vh;
  background-image: url(https://wallpaper.forfun.com/fetch/c5/c50189e1ab11216f0b7f458d957d9b19.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
}

.title {
  display: grid;
  justify-content: center;

  padding: 10px;
}

.title h1 {
  color: white;
  font-family: 'Arial';
  padding: 20px;
  text-shadow: 2px 2px 4px #000000;
}

.escogerRondas {
  display: grid;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 27%;
  left: 30%;
  width: 800px;
  height: 600px;
  background-image: url(https://www.solopress.com/blog/wp-content/uploads/2013/11/25pikachu-f1920x1200-1024x640.jpg);
  margin-bottom: 20px;
  border-radius: 10px;
  transition: transform 0.5s;
}


.escogerRondas:hover {
  transform: translate(0px, -10px);
}

.contenidoBatalla {
  display: flex;
}

.column {
  text-align: center;
  color: white;
  width: 33%;
  height: 600px;
}

#jugador1 {
  background-color: crimson;
  padding: 20px;
  margin: 30px;
  border-radius: 10px;
}

#jugador2 {
  background-color: blue;
  margin: 30px;
  padding: 20px;
  border-radius: 10px;
}

.btnRondas {
  width: 150px;
  height: 50px;
  margin: 30px;
}
</style>