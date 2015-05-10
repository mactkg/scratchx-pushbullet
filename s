#!/bin/sh
git checkout master -- pushbullet.js
python -m 'SimpleHTTPServer' &
shsid=$!
ngrok localhost:8000
kill -KILL $shsid
