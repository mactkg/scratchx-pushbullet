#!/bin/sh

python -m 'SimpleHTTPServer' &
shsid=$!
ngrok localhost:8000
kill -KILL $shsid
