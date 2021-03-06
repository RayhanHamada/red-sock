# red-sock ![Node.js Package](https://github.com/RayhanHamada/red-sock/workflows/Node.js%20Package/badge.svg)

A package for making connection between redux and socket.io-client

## Install

```sh
yarn add @mocchapine/red-sock
// or
npm i @mocchapine/red-sock
```

## Usage

Assumed that you have create a redux store, you could do

```ts
// import
const { connect } = require('socket.io-client');
const { connectRedSock } = require('@mocchapine/red-sock');

// or if u using es6 module
import { connect } from 'socket.io-client';
import { connectRedSock } from '@mocchapine/red-sock';

// create socket
const socket = connect('http://localhost:3000');

// call connectRedSock
const newSocket = connectRedSock(store, socket)
  /**
   * you can just pass a function that return object of socket event to the "on" method.
   * You also have access to the store's dispatch and getState method, and the actual socket's emit method
   */
  .on(({ dispatch, emit, getState }) => ({
    // and here is where you can register your socket event.
    // you can pass the socket event name here as the name of the function
    increment: () => {
      // dispatching inc event to store's reducer
      dispatch({
        type: 'INCREMENT',
      });
    },
    decrement: () => {
      dispatch({
        type: 'DECREMENT',
      });
    },

    /**
     * Usually, a socket event name can contain a non-alphanumeric character,
     * like 'join-room' or 'leave-room'. if your event name like so,
     * you could wrap the event name in a quote like below !
     */
    'increment-by': by => {
      console.log(`dispatching incBy action !`);
      dispatch({
        type: 'INCREMENT_BY',
        payload: by,
      });
    },

    /**
     * notice that you have access to emitted event's data by specifying
     * it as a parameter.
     *
     * normally, you probably would do
     *
     * socket.on('decrement-by', by => {
     *    dispatch({
     *      type: 'DECREMENT_BY',
     *      payload: by
     *    })
     * })
     *
     */
    'decrement-by': by => {
      dispatch({
        type: 'DECREMENT_BY',
        payload: by,
      });
    },
    // the function can be asynchronous too !
    'async-increment': async () => {
      // delay the dispatch for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));

      dispatch({
        type: 'INCREMENT',
      });
    },
  })); // the on function returns the same socket you've created before
```

The .on method returns the same socket object that you can use later.
Usually, i separate the store and the socket, in a javascript file called red-sock, and then export the socket object

### <b>With Typescript</b>

This package is built entirely in Typescript, so assumed that you're using Typescript and your reducer and store is strongly-typed, then red-sock is able to infer the type of your redux action (when dispatching action) and what is the shape of your redux's global state.

## License

MIT
