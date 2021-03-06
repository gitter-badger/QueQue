import select, pickle, os
from time import time
from socket import *
from json import loads, dumps

## == -- Requirements
## == *Nix OS that supports `Epoll`
## == Python2+ (3+ preferred)

## == In sockets, all client-sockets are stored as:
## ==    filedescriptor -> {addr -> address, sock -> socketobject}
sockets = {}
## == The access list defines which IP's (either socket or IP in jsondata)
## == has access to certain features
## (TODO: if jsondata, make sure it comes from the webserver!!!)
access_list = ['127.0.0.1', '83.253.236.108', '94.234.170.79']

## == Watch is a object (requires *Nix) that can be used to register/unregister
## == socket filedescriptors, this object is also used to
## == check if data is availible in the filedescriptor (socket)
## == without locking up the application making for a non-threaded application.
watch = select.epoll()

## == The main socket object listening for queries
sock = socket()
sock.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)
sock.bind(('', 7113))
sock.listen(4)

## == And we register it in EPoll()
watch.register(sock.fileno(), select.EPOLLIN)

def saveDBs():
	"""
	Does not return anything but tries to move
	existing .pic files to a .bkp file before
	opening and dumping queue and history into
	their respective .pic files.
	"""
	if os.path.isfile('./data/history.pic'):
		os.rename('./data/history.pic', './data/history.bkp')
	if os.path.isfile('./data/queue.pic'):
		os.rename('./data/queue.pic', './data/queue.bkp')

	with open('./data/history.pic', 'wb') as fh:
		pickle.dump(history, fh)
	with open('./data/queue.pic', 'wb') as fh:
		pickle.dump(queue, fh)

def loadDBs():
	"""
	Returns queue,history as a tuple.
	
	If there's no .pic file and not .bkp
	loadDBs() will return default values
	for each of the objects in the pair.

	If there's no .pic file but there is
	a .bkp file it will be renamed to .pic
	and a re-read is initiated.

	If there is a .pic but it's broken
	a backup-check is also initated.
	"""
	if os.path.isfile('./data/history.pic'):
		with open('./data/history.pic', 'rb') as fh:
			try:
				history = pickle.load(fh)
			except EOFError:
				history = None
	else:
		history = None
	if os.path.isfile('./data/queue.pic'):
		with open('./data/queue.pic', 'rb') as fh:
			try:
				queue = pickle.load(fh)
			except EOFError:
				queue = None
	else:
		queue = None
	
	if queue is None:
		if os.path.isfile('./data/queue.bkp'):
			os.rename('./data/queue.bkp', './data/queue.pic')
		else:
			queue = {'current' : 0}
	if history is None:
		if os.path.isfile('./data/history.bkp'):
			os.rename('./data/history.bkp', './data/history.pic')
		else:
			history = {}

	if queue is None or history is None:
		return loadDBs()
	return queue, history

def nextQnum():
	"""
	Returns the next available number in the queue.
	"""
	queuepositions = list(val for key, val in queue.items())
	if len(queuepositions) > 0:
		return max(queuepositions)+1
	else:
		return 0

class dataObject():
	def __init__(self, data, sendHandle, sockAddr):
		self.data = data
		self.send = sendHandle
		self.addr = sockAddr

		returndata = self.parse()
		self.send(bytes(dumps(returndata), 'UTF-8'))

	def number(self):
		## == TODO:
		## ==   When the user registers, send a web-request to XXX (can not find service)
		## ==   which then calls the users phone with a spoofed 6-digit number
		## ==   that should act as a 2-way-auth for verifying the identity of the user.

		## == TODO:
		## ==   Check if phone number is swedish, then check if available here: http://e-tjanster.pts.se/Documentation/API/NumberServiceWCF.aspx
		## ==   If phone number available or other error, don't allow user to register in queue.
		## == 	Display message to ask support for help if this happens.

		## == TODO:
		## ==   Verify phone-numbers and make sure that they are:
		## ==   +46[0-9]{9}  - Country-code specific for sweden
		## ==   07[0-9]{8}    - Traditional 073... numbers
		## ==   +[0-9]{1,15} - Other country-code specific numbers with unknown max length
		nr = self.data['number']
		if nr in queue:
			qPos = queue[nr]
			if qPos < queue['current']:
				qPos = nextQnum()
				queue[nr] = qPos
		else:
			qPos = nextQnum()
			queue[nr] = qPos

		history[qPos] = nr
		return {"number" : nr, "qpos" : qPos}

	def queue(self):
		## == A set of access-restricted features follows below
		if self.data['queue'] == 'next' and self.addr in access_list:
			if queue['current'] + 1 < nextQnum():
				queue['current'] += 1
			return {"queue" : queue['current'], "number" : history[queue['current']]}

		elif self.data['queue'] == 'upcoming' and self.addr in access_list:
			returnList = []
			for index in range(0, 10):
				if queue['current']+index in history:
					if index == 0:
						returnList.append({"number" : history[queue['current']+index], "qpos" : queue['current']+index, 'current' : True})
					else:
						returnList.append({"number" : history[queue['current']+index], "qpos" : queue['current']+index, 'current' : False})
			return {"upcoming" : returnList, "order" : "ascending"}

		elif self.data['queue'] == 'history' and sockets[fd]['addr'] in access_list:
			offset = 0
			if 'parameters' in self.data and 'offset' in self.data['parameters']:
				try:
					offset = int(self.data['parameters']['offset'])
				except ValueError:
					pass

			returnList = []
			for index in range(0+offset, 10+offset):
				if queue['current']-index in history:
					returnList.append({"number" : history[queue['current']-index], "qpos" : queue['current']-index})
			return {"offset" : offset, "history" : returnList, "order" : "reversed"}

		## == A set of open queries follows below:
		## == consider splitting these up into different function-checks.
		## == As of now, you can't check `in access_list` and separate
		## == the functions into a separate if block because then
		## == access-granted people won't be able to access the below features.
		elif self.data['queue'] == 'max':
			return {"queue" : nextQnum()-1}
		
		return {"queue" : queue['current']}

	def access(self):
		if self.data['access'] in access_list:
			return {"access" : True}
		return {"access" : False}

	def parse(self):
		self.data = loads(self.data.decode('utf-8'))
		print(self.addr,'asked:',self.data)
			
		if 'number' in self.data:
			return self.number()
		elif 'queue' in self.data:
			return self.queue()
		elif 'access' in self.data:
			return self.access()

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

			container = dataObject(data, sockets[fd]['sock'].send, sockets[fd]['addr'])

			# We'll close and remove each socket after we've parsed and returned data.
			# Mainly because the PHP page is session-based 
			watch.unregister(sockets[fd]['sock'].fileno())
			sockets[fd]['sock'].close()
			del sockets[fd]

	if time() - last_save > 5:
		saveDBs()
		last_save = time()