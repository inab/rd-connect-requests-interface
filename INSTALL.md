# RD-Connect Requests GUI dependencies and installation 

1. If you don't have it, compile and install as root NodeJS 8.x or later:

	```bash
	yum install -y gcc gcc-c++
	cd /tmp
	wget https://nodejs.org/download/release/v8.11.3/node-v8.11.3.tar.xz
	tar xf node-v8.11.3.tar.xz
	cd node-v8.11.3
	./configure
	make
	make install
	rm -rf /tmp/node-v*
	```

2. As the destination user (for instance `rdconnect-rest`) clone the code, install its dependencies, and prepare it for deployment:

	```bash
	cd "${HOME}"
	git clone https://github.com/inab/rd-connect-requests-interface.git
	cd rd-connect-requests-interface
	npm install --no-save
	export PATH="${PWD}/node_modules/.bin:$PATH"
	webpack
	```

3. Install the requests interfaces:

	```bash
	cp -dpTr build ../rd-connect-user-management/static_requests
	```
