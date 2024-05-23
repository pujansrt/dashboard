#!/usr/bin/env bash

cd /home/vagrant/dashboard
. env/bin/activate
env/bin/uwsgi --socket 0.0.0.0:8080 -w app:app