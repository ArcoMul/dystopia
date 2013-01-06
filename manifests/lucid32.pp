group { "puppet":
        ensure => "present",
}

File { owner => 0, group => 0, mode => 0644 }

file { '/etc/motd':
        content => "Welcome to your Vagrant-built virtual machine!
            Managed by Puppet.\n"
}

exec { 'apt-get update':
        command => '/usr/bin/apt-get update'
}

package { 'apache2' :
        ensure => present,
        require => Exec['apt-get update']
}

package { 'php5' :
        ensure => present,
        require => [ Package['apache2'] ]
}

package { 'vim' :
        ensure => present,
        require => Exec['apt-get update']
}

service { 'apache2' :
        ensure => running,
        require => [ Package['apache2'], File['vagrant-apache-default'], Exec['mv mod_rewrite'], Exec['mv mod_headers'] ]
}

file { 'vagrant-apache-default' :
        path => "/etc/apache2/sites-available/default",
        ensure => file,
        require => [ Package['apache2'] ],
        notify => Service['apache2'],
        source => "/vagrant/manifests/apache2-default"
}

exec { 'mv mod_rewrite':
        command => '/bin/mv /etc/apache2/mods-available/rewrite.load /etc/apache2/mods-enabled/rewrite.load',
        require => Package['apache2'],
        notify => Service['apache2']
}

exec { 'mv mod_headers':
        command => '/bin/mv /etc/apache2/mods-available/headers.load /etc/apache2/mods-enabled/headers.load',
        require => Package['apache2'],
        notify => Service['apache2']
}