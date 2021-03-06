import { Store } from 'redux';

/**
 * @description A customized SocketIOClient.Socket, just add event typing
 * (but not strict so you still could pass regular string)
 */
type CustomSocket<
  Name extends string,
  Fn extends (...args: any[]) => void | Promise<void>
> = Omit<SocketIOClient.Socket, 'on' | 'off' | 'once'> & {
  on: (
    event: Name | (string & { ignore?: any }),
    fn: Record<Name, Fn>[Name] | ((...args: any) => any) | undefined
  ) => SocketIOClient.Emitter;
  once: (
    event: Name | (string & { ignore?: any }),
    fn: ((...args: any) => any) | undefined
  ) => SocketIOClient.Emitter;
  off: (
    event: Name | (string & { ignore?: any }),
    fn?: ((...args: any) => any) | undefined
  ) => SocketIOClient.Emitter;
};

/**
 * @description For registering event
 */
type EventRegisterCreator<St extends Store<any, any>> = {
  on: <
    Name extends string,
    Fn extends (...args: any[]) => void | Promise<void>
  >(
    registerFn: (helper: {
      dispatch: St['dispatch'];
      getState: St['getState'];
      emit: SocketIOClient.Socket['emit'];
    }) => Record<Name, Fn>
  ) => CustomSocket<Name, Fn>;
};

/**
 * @description create connection between store and socket event
 */
type ConnectionCreator = <St extends Store<any, any>>(
  store: St,
  socket: SocketIOClient.Socket
) => EventRegisterCreator<St>;

export const connectRedSock: ConnectionCreator = (store, socket) => {
  try {
    const { emit } = socket;
    const { dispatch, getState } = store;

    return {
      on: registerFn => {
        const ev = registerFn({ dispatch, emit, getState });
        for (const key in ev) {
          socket.on(key, ev[key]);
        }

        return socket as any;
      },
    };
  } catch (e) {
    throw new Error('Error with socket connection');
  }
};
