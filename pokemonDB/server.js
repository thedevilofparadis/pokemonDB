const express = require('express');
const { Server } = require('ws');
const mysql = require('mysql');

const server = express()
  .use((req, res) => res.sendFile('/index.html', { root: __dirname }))
  .listen(3000, () => console.log('Listening on 3000'));

const ws_server = new Server({ server });

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pokemonDB"
});

// Variabili utilizzate per gestire utenti e duelli
let id = 0;              
let idAttesa = -1;        
let idPAttesa = -1;       
let duelli = [];          

// Connessione
ws_server.on('connection', (ws) => { 
  ws.id = id;              // Assegna un ID al client
  id++;
  const data = JSON.stringify({ 'azione': "id", id: ws.id });
  ws.send(data);           // Invia l’ID al client

  ws.on('close', () => {
    console.log("esce:" + ws.id);  // Log disconnessione client
  });	   

  // Gestione messaggi dal client
  ws.on('message', (message) => {   
    const messaggio = JSON.parse(message);

    if (messaggio.azione == "crea") {
      creaPokemon(ws, messaggio.stats);  // Richiesta creazione Pokémon
    }

    if (messaggio.azione == "vediNovita") {
      mostraNovita(ws);  // Richiesta di visualizzazione ultimi Pokémon creati
    }

    if (messaggio.azione == "richiestaDuello") {
      richiediDuello(ws, messaggio.idP);  // Richiesta duello
    }

    if (messaggio.azione == "attacco") {
      attacco(ws, messaggio.pesante);  // Attacco durante il duello
    }
  });
});

// Funzione: crea Pokémon se le stats sono valide
function creaPokemon(ws, stats) {
  let sommaStat = stats.attacco + stats.vita + stats.difesa;

  if (sommaStat <= 120 && stats.attacco >= 1 && stats.attacco <= 99 &&
      stats.vita >= 1 && stats.vita <= 99 && stats.difesa >= 1 && stats.difesa <= 99) {

    // Inserisce il Pokémon nel database
    let query = "INSERT INTO pokemon (nomeP, hpP, attP, defP) VALUES (\"" + stats.nome + "\"," + stats.vita + "," + stats.attacco + "," + stats.difesa + ")";
    eseguiQuery(query, function (err, queryResult) {
      if (err) {
        const data = JSON.stringify({ 'azione': "nomeDuplicato" });
        ws.send(data); // Nome già esistente
        console.log(err);
        return;
      }

      // Recupera l’ID massimo (ultimo inserito)
      query = "SELECT MAX(idP) as \"max\" FROM pokemon;";
      eseguiQuery(query, function (err, queryResult) {
        if (err) {
          console.log(err);
          return;
        }
        const data = JSON.stringify({ 'azione': "crea", idP: queryResult[0].max });
        ws.send(data); // Invia ID Pokémon al client
      });
    });
  } else {
    const data = JSON.stringify({ 'azione': "puntiInvalidi" });
    ws.send(data); // Stats non valide
  }
}

// Funzione: mostra gli ultimi 10 Pokémon creati
function mostraNovita(ws) {
  let query = "SELECT * FROM pokemon WHERE idP >= (SELECT MAX(idP) - 9 FROM pokemon) ORDER BY idP DESC;";
  eseguiQuery(query, function (err, totpokemon) {
    if (err) { console.log(err); return; }
    const data = JSON.stringify({ 'azione': "novita", lista: totpokemon });
    ws.send(data); // Invia lista al client
  });
}

// Funzione: matchmaking tra due giocatori e avvio del duello
function richiediDuello(ws, idP) {
  if (idAttesa == -1) {
    idAttesa = ws.id;       // Primo giocatore entra in attesa
    idPAttesa = idP;
    const data = JSON.stringify({ 'azione': "attendi" });
    ws.send(data);
  } else {
    // Secondo giocatore trovato: si forma un duello
    let iDuello = duelli.length;
    duelli[iDuello] = [idAttesa, ws.id];

    // Recupera i due Pokémon
    let query = "SELECT * FROM pokemon WHERE idP = " + idP + " OR idP = " + idPAttesa + ";";
    eseguiQuery(query, function (err, totpokemon) {
      if (err) { console.log(err); return; }

      let primoGiocatore;
      let pokemonPrimo;
      let pokemonSecondo;

      // Scelta casuale del primo giocatore
      if (parseInt(Math.random() * 10) % 2 == 0) {
        primoGiocatore = idAttesa;
        if (totpokemon[0].idP == idPAttesa) {
          pokemonPrimo = totpokemon[0];
          pokemonSecondo = totpokemon[1];
        } else {
          pokemonPrimo = totpokemon[1];
          pokemonSecondo = totpokemon[0];
        }
      } else {
        primoGiocatore = ws.id;
        if (totpokemon[1].idP == idPAttesa) {
          pokemonPrimo = totpokemon[0];
          pokemonSecondo = totpokemon[1];
        } else {
          pokemonPrimo = totpokemon[1];
          pokemonSecondo = totpokemon[0];
        }
      }

      // Salva Pokémon nel duello
      duelli[iDuello][2] = pokemonPrimo;
      duelli[iDuello][3] = pokemonSecondo;

      // Notifica inizio del duello a entrambi
      const data = JSON.stringify({
        'azione': "inizioDuello",
        "primo": primoGiocatore,
        "pokemonPrimo": pokemonPrimo,
        "pokemonSecondo": pokemonSecondo
      });

      ws.send(data);
      ws_server.clients.forEach((client) => {
        if (client.id == idAttesa) {
          client.send(data);
        }
      });

      // Resetta lo stato di attesa
      idAttesa = -1;
      idP = -1;
    });
  }
}

// Funzione: attacco da un giocatore durante un duello
function attacco(ws, pesante) {
  let idDuello = -1;
  let idAltro;
  let iPokemonAttaccante;
  let iPokemonAttaccato;

  // Cerca il duello a cui partecipa il giocatore
  for (let i = 0; i < duelli.length && idDuello == -1; i++) {
    if (duelli[i][0] == ws.id) {
      idDuello = i;
      iPokemonAttaccante = 2;
      iPokemonAttaccato = 3;
      idAltro = duelli[i][1];
    }
    if (duelli[i][1] == ws.id) {
      idDuello = i;
      iPokemonAttaccante = 3;
      iPokemonAttaccato = 2;
      idAltro = duelli[i][0];
    }
  }

  let attacco = parseInt(Math.random() * 100);
  let difesa = parseInt(duelli[idDuello][iPokemonAttaccato].defP * 0.75);
  if (pesante) {
    difesa += 5; // Attacco pesante aumenta la difficoltà di colpire
  }

  if (attacco < difesa) {
    // L'attacco è schivato
    const data = JSON.stringify({ 'azione': "risultatoAttacco", "schivato": true });
    ws_server.clients.forEach((client) => {
      if (client.id == idAltro || client.id == ws.id) {
        client.send(data);
      }
    });
  } else {
    // L'attacco va a segno
    let danno = 5 + parseInt(Math.random() * duelli[idDuello][iPokemonAttaccante].attP / 3);
    if (pesante) {
      danno = parseInt(danno * 1.2); // Più danno se pesante
    }

    duelli[idDuello][iPokemonAttaccato].hpP -= danno;

    if (duelli[idDuello][iPokemonAttaccato].hpP <= 0) {
      // Vittoria: il Pokémon avversario è KO
      const data = JSON.stringify({ 'azione': "risultatoAttacco", "vittoria": true });
      ws_server.clients.forEach((client) => {
        if (client.id == idAltro || client.id == ws.id) {
          client.send(data);
        }
      });
      duelli.splice(idDuello, 1); // Rimuove il duello
    } else {
      // Il Pokémon è ancora in vita
      const data = JSON.stringify({
        'azione': "risultatoAttacco",
        "vittoria": false,
        "schivato": false,
        "pokemonAttaccato": duelli[idDuello][iPokemonAttaccato]
      });
      ws_server.clients.forEach((client) => {
        if (client.id == idAltro || client.id == ws.id) {
          client.send(data);
        }
      });
    }
  }
}

// Funzione essenziale per eseguire query in modo corretto
function eseguiQuery(query, callback) {
  con.query(query, function (err, result) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
}
