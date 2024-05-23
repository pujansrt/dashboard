class init {

    file { "/home/vagrant/dashboard":
        ensure      => "directory",
        owner       => "vagrant",
        group       => "vagrant",
        mode        => "750",
        source      => "/vagrant/dashboard",
        recurse     => "remote",
    }
    
    file { "/etc/nginx/sites-available/dashboard":
        ensure      => "present",
        owner       => "root",
        group       => "root",
        mode        => "750",
        source      => "/vagrant/dashboard/dashboard",
    }

    file { "/etc/init/dashboard.conf":
        ensure      => "present",
        owner       => "root",
        group       => "root",
        mode        => "750",
        source      => "/vagrant/dashboard/dashboard.conf",
    }

    file { '/etc/nginx/sites-enabled/dashboard':
        ensure => 'link',
        target => '/etc/nginx/sites-available/dashboard',
    }

    file { "/etc/nginx/sites-available/default":
        ensure  => absent,
    }

    file { "/etc/nginx/sites-enabled/default":
        ensure  => absent,
    }

    file { '/etc/init.d/dashboard':
        ensure => 'link',
        target => '/etc/init/dashboard.conf',
    }

    exec { 'project_prepare':
        command     => '/home/vagrant/dashboard/prep.sh',
        path        => '/usr/local/bin/:/bin/:/usr/bin/',
        cwd         => '/home/vagrant/dashboard',
        user        => 'vagrant',
        logoutput   => 'on_failure'
    }
}

class run {
    require init

    service { "nginx":
      ensure => running,
      enable  => true,
      hasrestart => true,
      hasstatus => true,
      status => '/usr/sbin/service  nginx status | grep "running"'
    }

    service { "dashboard":
      ensure => running,
      enable  => true,
      hasrestart => true,
      hasstatus => true,
      status => '/usr/sbin/service  dashboard status | grep "running"'
    }
}

#include init
include run



