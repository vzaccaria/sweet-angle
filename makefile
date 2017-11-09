
all: compile.js
	./test/test.sh

compile.js: compile.ls
	echo '#!/usr/bin/env node' > $@
	lsc -p -c $<  >> $@
	chmod +x compile.js

test: compile.js examples/example.sa
	./compile.js examples/example.sa > ./example.js

clean:
	rm compile.js example.js