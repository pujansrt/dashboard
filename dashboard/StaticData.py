#!/usr/bin/env python

import platform
import psutil
import datetime
import os
import socket

class StaticData(object):
    """
    Fetches system data
    """

    def boottime_info(self):
        return datetime.datetime.fromtimestamp(psutil.boot_time()).strftime("%Y-%m-%d %H:%M:%S")

    def os_info(self):
        dc={};
        dc['system']=platform.system()
        dc['processor']=psutil.cpu_count()
        dc['platform']=platform.platform()
        dc['arch']=platform.architecture()[0]
        dc['version']=platform.version()
        dc['release']=platform.release()
        dc['name']=socket.gethostname()
        return dc

    def ip_address_fallback(self):
        list=[]
        if platform.system() == "Darwin":
            a=os.popen("ifconfig  | grep -E 'inet.[0-9]' | grep -v '127.0.0.1' | awk '{ print $2}'").read()
            b=os.popen("ifconfig  | grep -E 'inet6.[0-9]' | grep -v '127.0.0.1' | awk '{ print $2}'").read()
            if a:
                list.append(a.strip())
            if b:
                list.append(b.strip())

        if platform.system() == "Linux":
            a=os.popen("ifconfig  | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{ print $1}'").read()
            b=os.popen("ifconfig  | grep 'inet6 addr:'| grep 'Global' | grep -v 'fe80' | awk '{print $3}'").read()
            if a:
                list.append(a.strip())
            if b:
                list.append(b.strip())

        return list


    def ip_address(self):
        import socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            s.connect(("8.8.8.8", 80))
            ip=[s.getsockname()[0]]
        except:
            try:
                ip=self.ip_address_fallback()
            except:
                ip=['127.0.0.1']
        finally:
            s.close()
        return ip

    def python_info(self):
        return platform.python_version()