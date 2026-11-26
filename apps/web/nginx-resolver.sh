#!/bin/sh
# Writes the container's DNS server for nginx so API_UPSTREAM is resolved at request time (the container starts even when the API is not up yet).
# Override with NGINX_RESOLVER (for example 127.0.0.11 or 10.0.0.2).
ns="${NGINX_RESOLVER:-$(awk '/^nameserver/ {print $2; exit}' /etc/resolv.conf)}"
case "$ns" in *:*) ns="[$ns]" ;; esac
echo "resolver ${ns:-127.0.0.11} valid=10s ipv6=off;" > /etc/nginx/resolver.conf
