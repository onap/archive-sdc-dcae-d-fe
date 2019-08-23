dcae_be_vip = node['DCAE_BE_VIP']


if node['disableHttp']
  protocol = "https"
  dcae_be_port = node['DCAE']['BE'][:https_port]
  dcae_fe_port = node['DCAE']['FE'][:https_port]
else
  protocol = "http"
  dcae_be_port = node['DCAE']['BE'][:http_port]
  dcae_fe_port = node['DCAE']['FE'][:http_port]
end


printf("DEBUG: [%s]:[%s] disableHttp=[%s], protocol=[%s], dcae_be_vip=[%s], dcae_be_port=[%s] !!! \n", cookbook_name, recipe_name, node['disableHttp'], protocol, dcae_be_vip ,dcae_be_port )
raise "[ERROR] 'DCAE_BE_FQDN' is not defined" if dcae_be_vip.nil? || dcae_be_vip == ""

directory "DCAE FE_tempdir_creation" do
  path "#{ENV['JETTY_BASE']}/temp"
  owner 'jetty'
  group 'jetty'
  mode '0755'
  action :create
end


directory "#{ENV['JETTY_BASE']}/config" do
  owner "jetty"
  group "jetty"
  mode '0755'
  recursive true
  action :create
end


directory "#{ENV['JETTY_BASE']}/config/dcae-fe" do
  owner "jetty"
  group "jetty"
  mode '0755'
  recursive true
  action :create
end


template "dcae-fe-config" do
  sensitive true
  path "#{ENV['JETTY_BASE']}/config/dcae-fe/application.properties"
  source "dcae-application.properties.erb"
  owner "jetty"
  group "jetty"
  mode "0755"
  variables({
    :dcae_be_vip => dcae_be_vip,
    :dcae_be_port => dcae_be_port,
    :protocol => protocol,
    :dcae_fe_port => dcae_fe_port
  })
end


template "dcae-logback-spring-config" do
  sensitive true
  path "#{ENV['JETTY_BASE']}/config/dcae-fe/logback-spring.xml"
  source "dcae-logback-spring.erb"
  owner "jetty"
  group "jetty"
  mode "0755"
end
