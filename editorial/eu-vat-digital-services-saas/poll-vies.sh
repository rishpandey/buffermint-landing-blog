#!/bin/bash
out=/srv/buffermint/buffermint-landing/editorial/eu-vat-digital-services-saas/vies-status-2026-11-21.tsv
for i in $(seq 1 24); do
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  j=$(curl -s -m 30 https://ec.europa.eu/taxation_customs/vies/rest-api/check-status)
  if [ -z "$j" ]; then echo -e "$ts\tERROR\tno-response" >> $out; else
  echo "$j" | python3 -I -c "
import json,sys
d=json.load(sys.stdin)
for c in d['countries']: print('$ts\t'+c['countryCode']+'\t'+c['availability'])" >> $out; fi
  sleep 300
done
