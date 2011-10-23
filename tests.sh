if [ "$1" == "-c" ]
then
	rm -f lib/*~
	expresso -I lib-cov -c tests/* $2
	export pass=$?
	rm -fr lib-cov
	exit $pass
else
	expresso -I lib tests/*
	exit
fi