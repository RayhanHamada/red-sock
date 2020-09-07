import { expect } from 'chai';
import { connectSocketToRedux } from '../src/index';
import { store } from './clientSetup';

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
      console.log(`dispatching inc action !`);
      dispatch({
        type: 'inc',
      });
    },
    dec: () => {
      console.log(`dispatching dec action !`);
      dispatch({
        type: 'dec',
      });
    },

    /**
     * Usually, a socket event name can contain a non-alphanumeric string,
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
  it('should connected to server', function () {
    expect(socket.connected).to.be.true
  });
});
