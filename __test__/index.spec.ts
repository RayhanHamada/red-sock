import { expect } from 'chai';

import { connectSocketToRedux } from '../src/index';
import { store } from './clientSetup';
import { server } from './server';

/**
 * connect socket listener to store
 */
const socket = connectSocketToRedux(store, 'http://localhost:3000')
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
  this.beforeAll(function (done) {
    server.listen(3000);
    done();
  });

  this.afterEach(function (done) {
    socket.disconnect();
    done();
  });

  this.afterAll(function (done) {
    server.close(err => {
      if (err) console.error(err);
      console.log(`server closed`);
    });
    done();
  });

  /**
   * ===TEST===
   */
  it('should receive pong from server', function () {
    socket.on('pong', function (receive: string) {
      expect(receive).to.be.equal('pong');
    });

    socket.emit('ping');
  });
});

describe(`Store's`, function () {
  describe('count reducer', function () {
    this.timeout(5000);

    this.beforeAll(function (done) {
      server.listen(3000);
      done();
    });

    this.beforeEach(function (done) {
      socket.connect();
      done();
    });

    this.afterEach(function (done) {
      store.dispatch({
        type: 'resetCount',
      });

      store.dispatch({
        type: 'resetTodo',
      });

      socket.disconnect();
      done();
    });

    this.afterAll(function (done) {
      store.dispatch({
        type: 'resetCount',
      });

      store.dispatch({
        type: 'resetTodo',
      });

      socket.close();
      server.close();
      done();
    });

    /**
     * ===TEST===
     */
    it('should increment state by 1', function (done) {
      socket.emit('inc');

      setTimeout(() => {
        const countState = store.getState().count;
        expect(countState).to.be.equal(1);
        done();
      }, 2000);
    });

    it('should decrement state by 1', function (done) {
      socket.emit('dec');

      setTimeout(() => {
        const countState = store.getState().count;
        expect(countState).to.be.equal(-1);
        done();
      }, 2000);
    });

    it('should asynchronously increment state by 1', function (done) {
      socket.emit('async-inc');

      setTimeout(() => {
        expect(store.getState().count).to.be.equal(1);
        done();
      }, 3000);
    });
  });
});
