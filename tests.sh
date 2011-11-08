cd `dirname $0`
if [ "$1" == "-c" ]
then
	rm -f lib/*~
	rm -f app/*~

	EXPRESSO_TEST_PATH=`pwd`/coverage
	mkdir -p $EXPRESSO_TEST_PATH
	export NODE_PATH=$NODE_PATH:$EXPRESSO_TEST_PATH

	# i dont know what happened but for some reson expresso stoped unshifting -I or --include onto require.paths
	node-jscoverage lib coverage/lib
	node-jscoverage app coverage/app
	expresso -c tests/* $2

	export pass=$?
	rm -fr $EXPRESSO_TEST_PATH
	exit $pass
else
	EXPRESSO_TEST_PATH=`pwd`
	export NODE_PATH=$NODE_PATH:$EXPRESSO_TEST_PATH
	echo $NODE_PATH
	expresso tests/*
	exit
fi