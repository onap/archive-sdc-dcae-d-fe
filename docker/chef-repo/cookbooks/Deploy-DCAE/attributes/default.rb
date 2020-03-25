default['JETTY_BASE'] = "/var/lib/jetty"
default['JETTY_HOME'] = "/usr/local/jetty"
default['APP_LOG_DIR'] = "/opt/logs/fe"

default['DCAE']['BE'][:http_port] = 8082
default['DCAE']['BE'][:https_port] = 8444

default['DCAE']['FE'][:http_port] = 8183
default['DCAE']['FE'][:https_port] = 9444

default['jetty'][:keystore_pwd] = "?(kP!Yur![*!Y5!E^f(ZKc31"
default['jetty'][:keymanager_pwd] = "?(kP!Yur![*!Y5!E^f(ZKc31"
default['jetty'][:truststore_pwd] = "z+KEj;t+,KN^iimSiS89e#p0"

default['disableHttp'] = true

