import axios from 'axios';
import './App.css';
import { useState } from 'react';

function App() {
  const [playerSearchText, setPlayerSearch] = useState("");
  const [gameList, setGameList] = useState([]);
  const [playerData, setPlayerData] = useState({});
  const [playerMatches, setPlayerMatches] = useState([]);

  function handleSearchButtonClick(event) {
    console.log("Button clicked");
    //Separate ID
    var [gameName, tagLine] = playerSearchText.split('#');
    //GET /accountdetails
    axios.get("http://localhost:4000/accountdetails", { params: {gamename: gameName, tagline: tagLine}})
    .then(function (response) {
      console.log("SET PLAYER DATA");
      setPlayerData(response.data);
    }).catch(function (error){
      console.log(error);
    });

    //GET /last5games
    axios.get("http://localhost:4000/past5games", { params: {gamename: gameName, tagline: tagLine}})
    .then(function (response) {
      setGameList(response.data);
      setPlayer(response.data, gameName);
    }).catch(function (error){
      console.log(error);
    });

    
  }

  function setPlayer(gList, name){
    const playerMatches = new Array(gList.length);
    for (let i = 0; i < playerMatches.length; i++) {
      var player = gList[i].info.participants.find(el => el.riotIdGameName === name);

      playerMatches[i] = player; 
    }
    setPlayerMatches(playerMatches);
  }

  console.log(gameList);
 // console.log(playerData);

  return (
    <div className="app">
      <div className="header">
        <h3>gg.op</h3>
      </div>
      <div className="player-search">
        Type your player name:
        <input type="text" onChange={e => setPlayerSearch(e.target.value)}></input>
        <button onClick={e => handleSearchButtonClick(e)}>Search</button>
      </div>
      <div className='overview'>
      {JSON.stringify(playerData) !== '{}' ? 
      <>
      <p>{playerSearchText}</p>
      <img width="100" height="100" src={"https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/"+playerData.profileIconId+".png"}></img>
      <p>Summoner level {playerData.summonerLevel}</p>
      </>
      : 
      <><p> No data.</p> </>
    }
    </div>
    <div className='content'>
      <div className='match-history-stats'>
      <div className='match-history'>
      {gameList.length !== 0 ?
        <>
           {
            gameList.map((gameData, index) => 
            <>
            
            <div className='match-over'>
              
              <div className={"match "+playerMatches[index].win}>
                
                <div className='deco'></div>
                <div className='match-content'>
                  <div className='match-inner'>
                    <div className='match-left'>
                      <div className='head-group'>
                        <div className='game-type'>Ranked Solo</div>
                        <div className='time-stamp'>10 days ago</div>
                      </div>
                      <div className='divider'></div>
                      <div className='head-group'>
                        <div className='result'>Victory</div>
                        <div className='game-length'>12min 23sec</div>
                      </div>
                    </div>
                    <div className='match-center'>
                      <div className='main'>
                        <div className='info'>
                          <div className='champion'>
                          <img src={"https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/"+playerMatches[index].championName+".png"} width="48" height="48" alt={playerMatches[index].championName}></img>
                          <span className='champion-level'>{playerMatches[index].champLevel}</span>
                          </div>
                          <div className='runes-summs'>
                            <div className='runes'></div>
                            <div className='summs'></div>
                          </div>
                        </div>
                        <div className='kda-stats'></div>
                        <div className='game-stats'></div>
                      </div>
                      <div className='sub'></div>

                    </div>
                    <div className='match-right'>right</div>
                  </div>
                </div>
              </div>
              
            </div>
            </>
            )
           }
        </>
        :
        <>
        <p> We have no match data.</p>
        
        </>
      }
      </div>
      </div>
      </div>
    </div>
    
  );
}

export default App;
