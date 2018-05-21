FROM onap/base_sdc-jetty:1.2.0-SNAPSHOT-latest

COPY chef-solo /var/opt/dcae-fe/chef-solo/

COPY startup.sh /var/opt/dcae-fe/

ADD target/dcae_*.war ${JETTY_BASE}/webapps/

USER root

RUN mkdir -p /opt/logs/fe

COPY set_user.sh /tmp/set_user.sh

RUN sh -x /tmp/set_user.sh && rm -f /tmp/set_user.sh

RUN chown -R jetty:jetty ${JETTY_BASE}/webapps  /var/opt/dcae-fe  /opt/logs  /var/lib/jetty

RUN chmod 770 /var/opt/dcae-fe/startup.sh

EXPOSE 8082 8444

USER jetty

ENTRYPOINT [ "/var/opt/dcae-fe/startup.sh" ]

