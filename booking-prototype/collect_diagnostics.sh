#!/usr/bin/env bash
set -euo pipefail
echo "== PEGGY DIAGNOSTICS == $(date -u +%Y-%m-%dT%H:%M:%SZ) =="

echo "\n-- Basic system info"
whoami || true
id || true
uname -a || true

echo "\n-- Node / NPM"
node -v 2>/dev/null || echo "node: (not found)"
npm -v 2>/dev/null || echo "npm: (not found)"

echo "\n-- Working directory"
pwd
ls -la

echo "\n-- .env (masked)"
if [ -f .env ]; then
  sed -n '1,240p' .env | sed -E \
    -e 's/^(TWILIO_TOKEN=).*/\1***REDACTED***/' \
    -e 's/^(TWILIO_SID=)(.+)/\1\2...REDACTED/' \
    -e 's/^(TWILIO_FROM=).*/\1***REDACTED***/' \
    -e 's/^(TWILIO_MESSAGING_SERVICE_SID=).*/\1***REDACTED***/' || true
else
  echo ".env not found"
fi

echo "\n-- Node processes"
ps aux | grep '[n]ode' || true

echo "\n-- Listening ports (4000)"
ss -ltnp 2>/dev/null | grep :4000 || (sudo lsof -i :4000 2>/dev/null || true)

echo "\n-- systemd service: booking-prototype"
sudo systemctl status booking-prototype --no-pager 2>/dev/null || echo "service not found or no permission"
sudo journalctl -u booking-prototype -n 200 --no-pager 2>/dev/null || echo "no journal or no permission"

echo "\n-- PM2 processes"
pm2 list 2>/dev/null || echo "pm2 not running or no pm2"

echo "\n-- App logs (last 200 lines)"
for f in logs/out.log logs/bookings.log logs/sms.log; do
  echo "\n>>> $f"
  if [ -f "$f" ]; then
    tail -n 200 "$f" || true
  else
    echo "(missing)"
  fi
done

echo "\n-- Nginx config & logs"
sudo nginx -t 2>/dev/null || echo "nginx test failed or no permission"
sudo ls -la /etc/nginx/sites-enabled 2>/dev/null || true
sudo sed -n '1,240p' /etc/nginx/sites-enabled/peggy-site 2>/dev/null || sudo sed -n '1,240p' /etc/nginx/sites-enabled/peggybeautysalon.com 2>/dev/null || true
sudo tail -n 200 /var/log/nginx/error.log 2>/dev/null || true
sudo tail -n 200 /var/log/nginx/access.log 2>/dev/null || true

echo "\n-- Permissions for client dist"
if [ -d ../peggy-beauty-clone/dist ]; then
  ls -la ../peggy-beauty-clone/dist | sed -n '1,120p' || true
  stat -c '%U:%G %a %n' ../peggy-beauty-clone/dist 2>/dev/null || true
else
  echo "../peggy-beauty-clone/dist not present"
fi

echo "\n-- Quick HTTP checks (local)"
curl -s -o /dev/null -w "GET / -> %{http_code}\n" http://127.0.0.1:4000/ || echo "curl failed"
curl -s -o /dev/null -w "POST /create-booking -> %{http_code}\n" -X POST -H "Content-Type: application/json" -d '{"customerName":"diag","email":"diag@local","phone":"+10000000000","serviceName":"Test","appointmentTime":"2026-06-11T10:00:00"}' http://127.0.0.1:4000/create-booking || echo "curl failed"

echo "\n-- End diagnostics"

echo "\nNote: if commands requiring sudo fail, re-run the script with a user who can sudo or run the individual sudo commands as needed."
