const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
    const sharedSession = require('express-socket.io-session');
    gIo.use(sharedSession(session, {
            autoSave: true
        }));
    gIo.on('connection', socket => {
        console.log("someone joined!!!!!")
        // console.log('socket.handshake', socket.handshake)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket;
        socket.on('disconnect', (socket) => {
            console.log('Someone disconnected');
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null;
            }
        })
        socket.on('user msg', (topic) => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            // logger.debug('Session ID is', socket.handshake.sessionID)
            socket.myTopic = topic;
        });
        socket.on('order topic', (topic) => {
            console.log('topic:', topic);
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            // logger.debug('Session ID is', socket.handshake.sessionID)
            socket.myTopic = topic;
        });
        socket.on('chat newMsg', (msg) => {
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            gIo.to(socket.myTopic).emit('chat addMsg', msg);
        });
        socket.on('review topic', (topic) => {
            if (socket.myTopic === topic) return;
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            logger.debug('Session ID is', socket.handshake.sessionID)
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('review addReview',review=>{
            console.log(review,'Review at backend');
            socket.broadcast.emit('review-added', review);
        })
        socket.on('add msg',msg=>{
            socket.broadcast.emit('show msg', msg);
        })
        socket.on('orderSent', (order) => {
            console.log(order.tour._guideId, 'Order at backend');
            console.log(socket.myTopic,'My Topic');
            gIo.to(socket.myTopic).emit('addOrder', order);
        });
        socket.on('review-added', (review) => {
            // emits to all sockets:
            // gIo.emit('chat addMsg', msg)
            // emits only to sockets in the same room
            socket.broadcast.emit('review-added', review);
        });
    })
}

function emit({ type, data }) {
    gIo.emit(type, data);
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data);
}

// Send to all sockets BUT not the current socket
function broadcast({ type, data }) {
    const store = asyncLocalStorage.getStore();
    const { sessionId } = store;
    if (!sessionId)
        return logger.debug(
            'Shoudnt happen, no sessionId in asyncLocalStorage store'
        );
    const excludedSocket = gSocketBySessionIdMap[sessionId];
    if (!excludedSocket)
        return logger.debug(
            'Shouldnt happen, No socket in map',
            gSocketBySessionIdMap
        );
    excludedSocket.broadcast.emit(type, data);
}

module.exports = {
    connectSockets,
    emit,
    broadcast,
};
     // socket.on('chat topic', topic => {
        //     if (socket.myTopic === topic) return;
        //     if (socket.myTopic) {
        //         socket.leave(socket.myTopic)
        //     }
        //     socket.join(topic)
        //     // logger.debug('Session ID is', socket.handshake.sessionID)
        //     socket.myTopic = topic
        // })