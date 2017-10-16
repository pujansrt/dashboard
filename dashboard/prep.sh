#!/usr/bin/env bash

cd /home/vagrant/dashboard
/usr/local/bin/virtualenv env
source env/bin/activate
/home/vagrant/dashboard/env/bin/pip install -r requirements.txt --no-cache-dir

