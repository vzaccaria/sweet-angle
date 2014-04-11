#!/bin/sh



# Get basename:
# use bn = `get_base_name xyx..`

function get_base_name {
	n=$1
	n=$(basename "$n")
	echo "${n%.*}"
}

function check_if_failed {
	if [[ $1 -eq 0 ]]
	then
	   echo "OK"
	else
	   echo "KO"
	fi
}

#
# Current directory
#
srcdir=`dirname $0`
srcdir=`cd $srcdir; pwd`


dstdir=`pwd`


for i in $srcdir/*.sa; do
	f=`get_base_name $i`
	echo ""
	echo ""
	echo "--> $i"
	$srcdir/../compile.js $srcdir/$f.sa > $srcdir/$f.sat
	diff $srcdir/$f.sat $srcdir/$f.sar
done
