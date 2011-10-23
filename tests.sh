cd `dirname $0`
if [ "$1" == "-c" ]
then
	rm -f lib/*~
	rm -f app/*~
	export EXPRESSO_TEST_PATH=`pwd`/coverage
	mkdir -p $EXPRESSO_TEST_PATH
	# i dont know what happened but for some reson expresso stoped unshifting -I or --include onto require.paths
	node-jscoverage lib coverage/lib
	node-jscoverage app coverage/app
	expresso -I coverage -c tests/* $2
	export pass=$?
	rm -fr $EXPRESSO_TEST_PATH
	exit $pass
else
	export EXPRESSO_TEST_PATH=`pwd`
	expresso -I lib tests/*
	exit
fi