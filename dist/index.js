"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocketToRedux = void 0;
const socket_io_client_1 = require("socket.io-client");
exports.connectSocketToRedux = (store, url, config) => {
    try {
        const socket = socket_io_client_1.connect(url, config);
        const { emit } = socket;
        const { dispatch, getState } = store;
        return {
            on: registerFn => {
                const ev = registerFn({ dispatch, emit, getState });
                for (const key in ev) {
                    socket.on(key, ev[key]);
                }
                return socket;
            },
        };
    }
    catch (e) {
        throw new Error('Error with socket connection');
    }
};
