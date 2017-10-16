#!/usr/bin/env python
from threading import Lock
from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect

from StaticData import StaticData
from DynamicData import DynamicData
import json

#async_modes = threading, eventlet, gevent, None
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None
thread_lock = Lock()


def background_thread():
    """socket.io to clients"""
    dc1={}
    st = StaticData()
    dc1['os_info']=st.os_info()
    dc1['ip_address']=st.ip_address()
    dc1['boottime_info']=st.boottime_info()
    dc1['python_info']=st.python_info()

    count = 0
    while True:
        dc2={}
        dn = DynamicData()
        dc2['memory_info'] = dn.memory_info()
        dc2['cpu_info'] = dn.cpu_info()
        dc2['disk_info'] = dn.disk_info()

        ret = {}
        ret['static']=dc1
        ret['dynamic']=dc2

        socketio.sleep(1)
        count += 1
        socketio.emit('my_response',
                      {'data': json.dumps(ret), 'count': count},
                      namespace='/dashboard')


@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('my_ping', namespace='/dashboard')
def ping_pong():
    emit('my_pong')


@socketio.on('connect', namespace='/dashboard')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})


@socketio.on('disconnect', namespace='/dashboard')
def test_disconnect():
    print('Client disconnected', request.sid)


if __name__ == '__main__':
    import logging, logging.config, yaml

    logging.config.dictConfig(yaml.load(open('logging.conf')))
    logfile = logging.getLogger('file')
    logconsole = logging.getLogger('console')
    logfile.debug("Debug FILE")
    logconsole.debug("Debug CONSOLE")
    socketio.run(app, debug=True)
