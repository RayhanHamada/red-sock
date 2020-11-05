import { expect } from 'chai';
import { connect } from 'socket.io-client';

import { connectRedSock } from '../src/index';
import { store } from './clientSetup';
import { io } from './server';

/**
 * create socket
 */
const socket = connect('http://localhost:3000');

/**
 * connect socket listener to store
 */
const newSocket = connectRedSock(store, socket)
  /**
   * register socket event to the actual socket
   */
  .on(({ dispatch }) => ({
    /**
     * you can pass the socket event name here as the name of the function
     */
    inc: () => {
      /**
       * dispatching inc event to store's reducer
       */
      // console.log(`dispatching inc action !`);
      dispatch({
        type: 'inc',
      });
    },
    dec: () => {
      // console.log(`dispatching dec action !`);
      dispatch({
        type: 'dec',
      });
    },

    /**
     * the function can be asynchronous too !
     */
    'async-inc': async () => {
      // delay the dispatch
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      dispatch({
        type: 'inc',
      });
    },

    /**
     * Usually, a socket event name can contain a non-alphanumeric character,
     * like 'join-room' or 'leave-room'. if your event name like so,
     * you could wrap the event in a quote like below !
     */
    'inc-by': (by: number) => {
      console.log(`dispatching incBy action !`);
      dispatch({
        type: 'incBy',
        payload: by,
      });
    },
    'dec-by': (by: number) => {
      dispatch({
        type: 'decBy',
        payload: by,
      });
    },
  }));

describe('Socket', function () {
  /**
   * ===TEST===
   */
  it('should receive pong from server', function () {
    newSocket.on('pong', function (receive: string) {
      expect(receive).to.be.equal('pong');
    });

    newSocket.emit('ping');
  });
});

describe(`Store's`, function () {
  describe('count reducer', function () {
    this.timeout(5000);

    this.afterEach(function () {
      store.dispatch({
        type: 'resetCount',
      });

      store.dispatch({
        type: 'resetTodo',
      });
    });

    this.afterAll(function (done) {
      store.dispatch({
        type: 'resetCount',
      });

      store.dispatch({
        type: 'resetTodo',
      });

      newSocket.close();
      io.close();
      done();
    });

    /**
     * ===TEST===
     */
    it('should increment state by 1', function (done) {
      newSocket.emit('inc');

      setTimeout(() => {
        const countState = store.getState().count;
        expect(countState).to.be.equal(1);
        done();
      }, 2000);
    });

    it('should decrement state by 1', function (done) {
      newSocket.emit('dec');

      setTimeout(() => {
        const countState = store.getState().count;
        expect(countState).to.be.equal(-1);
        done();
      }, 2000);
    });

    it('should asynchronously increment state by 1', function (done) {
      newSocket.emit('async-inc');

      setTimeout(() => {
        expect(store.getState().count).to.be.equal(1);
        done();
      }, 3000);
    });
  });
});
