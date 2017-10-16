import psutil

class DynamicData(object):
    """
    Fetches system data
    """

    def memory_info(self):
        vm=psutil.virtual_memory()
        dc={};
        dc['total'] = vm.total
        dc['available'] = vm.available
        dc['usage'] = vm.available*100/vm.total
        return dc

    def cpu_info(self):
        dc={}
        dc['usage'] = psutil.cpu_percent(interval=1)
        dc['processor'] = psutil.cpu_count()
        return dc

    def disk_info(self):
        v=psutil.disk_usage('/')
        dc={}
        dc['free']=v.free
        dc['total']=v.total
        dc['percent']=v.percent
        return dc