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
      <div class="containerBatalla">
        <div class="columnas" id="jugador1">
          <h4>Jugador 1</h4>
          <div v-if="pokemon1">
            <p>{{ pokemon1.name }}</p>
            <img :src="pokemon1.sprites.front_default" alt="Pokemon 1">
            <p v-if="stat1">Stat {{ statInput }}: {{ stat1.base_stat }}</p>
            <p>Rondas ganadas: {{ victoriasJugador1 }}</p>
          </div>
        </div>
        <div class="columnas" id="lucha">
          <h4>lucha</h4>
          <div>
            <p>Stats disponibles: hp, attack, defense, special-attack, special-defense, speed</p>
          </div>
          <div v-if="statResult !== null">
            <p>{{ winnerMessage }}</p>
          </div>
          <div v-if="rondasRestantes > 0">
            <p>Rondas restantes: {{ rondasRestantes }}</p>
          </div>
          <div v-else>
            <p>{{ finalMessage }}</p>
            <button @click="reiniciarJuego">Reiniciar Juego</button>
          </div>
        </div>
        <div class="columnas" id="jugador2">
          <h4>Jugador 2</h4>
          <div v-if="pokemon2">
            <p>{{ pokemon2.name }}</p>
            <img :src="pokemon2.sprites.front_default" alt="Pokemon 2">
            <p v-if="stat2">Stat {{ statInput }}: {{ stat2.base_stat }}</p>
            <p>Rondas ganadas: {{ victoriasJugador2 }}</p>
          </div>
        </div>
      </div>
      <div class="inputs">
        <input v-model="numberInput" type="number" placeholder="Pokemon">
        <select v-model="statInput">
          <option value="" disabled selected>Seleccione un stat</option>
          <option value="hp">HP</option>
          <option value="attack">Attack</option>
          <option value="defense">Defense</option>
          <option value="special-attack">Special Attack</option>
          <option value="special-defense">Special Defense</option>
          <option value="speed">Speed</option>
        </select>
        <button @click="luchar" :disabled="rondasRestantes <= 0">Luchar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from 'vue';
import { useQuasar } from 'quasar'

const mostrarRondas = ref(true);
const numberInput = ref(null);
const statInput = ref('');
const pokemon1 = ref(null);
const pokemon2 = ref(null);
const stat1 = ref(null);
const stat2 = ref(null);
const statResult = ref(null);
const winnerMessage = ref('');
const rondasRestantes = ref(0);
const victoriasJugador1 = ref(0);
const victoriasJugador2 = ref(0);
const finalMessage = ref('');
const $q = useQuasar()
 


function escogerRondas(rondas) {
  rondasRestantes.value = rondas;
  victoriasJugador1.value = 0;
  victoriasJugador2.value = 0;
  mostrarRondas.value = false;
}

async function luchar() {
  if (!numberInput.value || numberInput.value <= 0) {
     $q.notify({
          message: 'Digite un numero valido',
          icon: 'announcement',
          position:"top-right",
          type:"negative"
        }) 
    return;
  }

  if (!statInput.value) {
    $q.notify({
          message: 'Digite un stat valido',
          icon: 'announcement',
          position:"top-right",
          type:"negative"
        }) 
    return;
  }

  try {
    const randomPokemon1 = Math.floor(Math.random() * 898) + 1; 
    const randomPokemon2 = Math.floor(Math.random() * 898) + 1; 

    const response1 = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon1}`);
    const response2 = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemon2}`);
    pokemon1.value = response1.data;
    pokemon2.value = response2.data;

    stat1.value = pokemon1.value.stats.find(stat => stat.stat.name === statInput.value);
    stat2.value = pokemon2.value.stats.find(stat => stat.stat.name === statInput.value);

    if (stat1.value && stat2.value) {
      statResult.value = stat1.value.base_stat - stat2.value.base_stat;
      if (statResult.value > 0) {
        winnerMessage.value = `El ganador es ${pokemon1.value.name} con un stat de ${stat1.value.base_stat}`;
        victoriasJugador1.value++;
      } else if (statResult.value < 0) {
        winnerMessage.value = `El ganador es ${pokemon2.value.name} con un stat de ${stat2.value.base_stat}`;
        victoriasJugador2.value++;
      } else {
        winnerMessage.value = "Es un empate!";
      }
    } else {
      statResult.value = "Stat no encontrado en uno o ambos Pokémon.";
      winnerMessage.value = '';
    }

    rondasRestantes.value--;

    if (rondasRestantes.value === 0) {
      if (victoriasJugador1.value > victoriasJugador2.value) {
        finalMessage.value = "Jugador 1 es el ganador!";
      } else if (victoriasJugador1.value < victoriasJugador2.value) {
        finalMessage.value = "Jugador 2 es el ganador!";
      } else {
        finalMessage.value = "Es un empate!";
      }
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
    alert("Error al obtener los datos del Pokémon. Por favor, intente nuevamente.");
  }
}

function reiniciarJuego() {
  mostrarRondas.value = true;
  numberInput.value = null;
  statInput.value = '';
  pokemon1.value = null;
  pokemon2.value = null;
  stat1.value = null;
  stat2.value = null;
  statResult.value = null;
  winnerMessage.value = '';
  rondasRestantes.value = 0;
  victoriasJugador1.value = 0;
  victoriasJugador2.value = 0;
  finalMessage.value = '';
}
</script>

<style>
 *{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f0f0f0;
}

.container {
  position: relative;
  height: 100vh;
  background-image: url(https://images5.alphacoders.com/135/1351278.png);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.title h1 {
  color: white;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  text-shadow: 2px 2px 4px #000000;
}

.escogerRondas {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.btnRondas {
  width: 150px;
  height: 50px;
  margin: 10px;
}

.contenidoBatalla {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.containerBatalla {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.columnas {
  text-align: center;
  color: white;
  width: 30%;
  padding: 30px; 
  border-radius: 10px;
  font-size: 1.5em;
}

#jugador1 {
  background-color: rgba(220, 20, 60, 0.8);
}

#jugador2 {
  background-color: rgba(0, 0, 255, 0.8);
}

#lucha {
  background-color: rgba(0, 0, 0, 0.8);
}

.inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.inputs input,
.inputs select {
  width: 250px; 
  height: 40px; 
  margin: 10px;
  padding: 10px; 
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1.2em; 
}

.inputs button {
  width: 150px; 
  height: 50px; 
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.2em; 
}

.inputs button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.inputs button:hover:not(:disabled) {
  background-color: #0056b3;
}

@media (max-width:830px){

  .container{
    background-image: none;
    height: auto;
  }
  .containerBatalla{
    display: grid;
  }

 .columnas{
  flex-direction: row;
  height: 350px;
  width: 600px;
  margin: 20px;
  justify-content: center;
 }

 .columnas img {
    max-width: 50%;
    height: auto;
  }

  .columnas p {
    margin-left: 10px;
    flex: 1;
  }
}

@media (max-width: 630px){
  .columnas{
    width: 400px;
  }
} 


</style>
