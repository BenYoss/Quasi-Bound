import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { io } from 'socket.io-client';
import { makeStyles } from '@material-ui/core/styles';

import Navbar from './Navbar';

import SplashPage from './Splashpage';
import Homepage from './Homepage/Homepage';
import Rules from './Homepage/Rules';
import Profile from './Profile/Profile';
import Deck from './Deck/Deck';
import PlayHub from './PlayHub/PlayHub';
import GameEnv from './GameEnv/GameEnv';
import Login from './Login';

const socket = io.connect('', {
  transports: ['websocket'],
});

const useStyles = makeStyles({
  alertFormat: {
    position: 'absolute',
    top: '0',
  },
});

const App = () => {
  const [user, setUser] = useState(false);
  const [nav, setNav] = useState(true);
  const [invitee, setInvitee] = useState('');
  const [enemyId, setEnemyId] = useState();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  if (user) {
    socket.on(`${user.id} Accept?`, (id, name) => {
      setEnemyId(id);
      setOpen(true);
      setInvitee(name);
    });
    socket.on(`${user.id} Proceed`, () => {
      window.location.href = '/game';
    });
  }
  useEffect(() => axios.get('/data/user').then(({ data }) => setUser(data)), []);
  // function Alert(props) {
  //   return <MuiAlert elevation={6} variant="filled" {...props} />;
  // }
  return (
    <div className="root">
      <Snackbar
        open={open}
        className={classes.alertFormat}
        autoHideDuration={6000}
        onClose={() => setOpen(!open)}
      >
        <Alert severity="info">
          <h2>{`${invitee} has invited you. Join Game?`}</h2>
          <button
            type="submit"
            onClick={() => {
              socket.emit('Accept', enemyId, user.id);
            }}
          >
            Accept
          </button>
          <button type="submit" onClick={() => setOpen(false)}>Decline</button>
        </Alert>
      </Snackbar>
      <BrowserRouter>
        {(window.location.pathname !== '/game' && nav) ? <Navbar user={user} /> : null}
        <Switch>
          <Route exact path="/">
            <SplashPage user={user} />
          </Route>
          <Route path="/home">
            <Homepage user={user} setNav={setNav} />
          </Route>
          <Route path="/rules">
            <Rules />
          </Route>
          <Route path="/profile">
            <Profile user={user} />
          </Route>
          <Route path="/deck">
            <Deck user={user} />
          </Route>
          <Route path="/playhub">
            <PlayHub user={user} />
          </Route>
          <Route path="/game">
            <GameEnv setNav={setNav} />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
