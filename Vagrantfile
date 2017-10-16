Vagrant.configure("2") do |config|
    config.vm.box = "hashicorp/precise64"
  	config.vm.provision :shell, path: "bootstrap.sh"
  	#config.vm.provision "puppet"
    config.vm.provision "puppet" do |puppet|
      puppet.manifests_path = "puppet/manifests"
      puppet.manifest_file  = "default.pp"
    end
  	config.vm.network :forwarded_port, guest: 80, host: 8000
end
