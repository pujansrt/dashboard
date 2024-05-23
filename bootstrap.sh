#!/usr/bin/env bash

apt update -y

apt upgrade -y

apt install -y build-essential python3 python3-dev python3-pip nginx puppet -q

pip3 install virtualenv

