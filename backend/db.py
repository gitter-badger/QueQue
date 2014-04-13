import select, pickle, os
from time import time
from socket import *
from json import loads, dumps

sockets = {}
access_list = ['127.0.0.1', '83.253.236.108']
watch = select.epoll()

sock = socket()
sock.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
sock.bind(('', 7113))
sock.listen(4)
watch.register(sock.fileno(), select.EPOLLIN)

def saveDBs():
	if os.path.isfile('history.pic'):
		os.rename('history.pic', 'history.bkp')
	if os.path.isfile('queue.pic'):
		os.rename('queue.pic', 'queue.bkp')

	with open('history.pic', 'wb') as fh:
		pickle.dump(history, fh)
	with open('queue.pic', 'wb') as fh:
		pickle.dump(queue, fh)

def loadDBs():
	if os.path.isfile('history.pic'):
		with open('history.pic', 'rb') as fh:
			try:
				history = pickle.load(fh)
			except EOFError:
				history = None
	else:
		history = None
	if os.path.isfile('queue.pic'):
		with open('queue.pic', 'rb') as fh:
			try:
				queue = pickle.load(fh)
			except EOFError:
				queue = None
	else:
		queue = None
	
	if queue is None:
		if os.path.isfile('queue.bkp'):
			os.rename('queue.bkp', 'queue.pic')
		else:
			queue = {'current' : 0}
	if history is None:
		if os.path.isfile('history.bkp'):
			os.rename('history.bkp', 'history.pic')
		else:
			history = {}

	if queue is None or history is None:
		return loadDBs()
	return queue, history

def nextQnum():
	queuepositions = list(val for key, val in queue.items())
	if len(queuepositions) > 0:
		return max(queuepositions)+1
	else:
		return 0

queue, history = loadDBs()
last_save = time()
while 1:
	for fd, event in watch.poll(0.02):
		if fd == sock.fileno():
			ns, na = sock.accept()
			watch.register(ns.fileno(), select.EPOLLIN)
			sockets[ns.fileno()] = {'addr' : na[0], 'sock' : ns}
		else:
			data = sockets[fd]['sock'].recv(8192)
			if data == b'':
				watch.unregister(sockets[fd]['sock'].fileno())
				del sockets[fd]
				continue
			jData = loads(data.decode('utf-8'))
			print(sockets[fd]['addr'],'asked:',jData)
			if 'number' in jData:
				nr = jData['number']
				if nr in queue:
					qPos = queue[nr]
					if qPos < queue['current']:
						qPos = nextQnum()
						queue[nr] = qPos
				else:
					qPos = nextQnum()
					queue[nr] = qPos

				history[qPos] = nr
				sockets[fd]['sock'].send(bytes(dumps({"number" : nr, "qpos" : qPos}), 'UTF-8'))
			elif 'queue' in jData:
				#if jData['queue'] == 'current':
				#	sockets[fd]['sock'].send(bytes(dumps({"queue" : queue['current']}), 'UTF-8'))
				if jData['queue'] == 'next' and sockets[fd]['addr'] == '127.0.0.1':
					if queue['current'] + 1 < nextQnum():
						queue['current'] += 1
					sockets[fd]['sock'].send(bytes(dumps({"queue" : queue['current'], "number" : history[queue['current']]}), 'UTF-8'))
				elif jData['queue'] == 'max':
					sockets[fd]['sock'].send(bytes(dumps({"queue" : nextQnum()-1}), 'UTF-8'))
				else:
					sockets[fd]['sock'].send(bytes(dumps({"queue" : queue['current']}), 'UTF-8'))
			elif 'access' in jData:
				if jData['access'] in access_list:
					sockets[fd]['sock'].send(bytes(dumps({"access" : True}), 'UTF-8'))
				else:
					sockets[fd]['sock'].send(bytes(dumps({"access" : False}), 'UTF-8'))

			watch.unregister(sockets[fd]['sock'].fileno())
			sockets[fd]['sock'].close()
			del sockets[fd]
			continue
	if time() - last_save > 5:
		saveDBs()
		last_save = time()