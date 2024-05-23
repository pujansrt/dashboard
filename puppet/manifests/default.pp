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
      status => '/usr/sbin/service nginx status | grep "running"'
    }

      # Ensure the service is enabled and started
  service { 'dashboard':
    ensure    => running,
    enable    => true,
    provider  => 'systemd',
    require   => File['/etc/systemd/system/dashboard.service'],
  }
}


class dashboard_service {

  file { '/etc/systemd/system/dashboard.service':
    ensure  => file,
    source  => '/home/vagrant/dashboard/dashboard.service',
    owner   => 'root',
    group   => 'root',
    mode    => '0644'
  }



  # Ensure systemd daemon is reloaded
  exec { 'systemd-daemon-reload':
    command     => '/bin/systemctl daemon-reload',
    refreshonly => true,
    subscribe   => File['/etc/systemd/system/dashboard.service'],
  }
}


#include init
include run

# Apply the class
include dashboard_service


