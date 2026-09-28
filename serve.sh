#!/bin/sh
# Serves the production build (dist/) on the port nginx-proxy-manager forwards to.
#
# Run `npm run build` before starting this; `dist/` is what gets served.
#
# Binds 0.0.0.0 because nginx-proxy-manager runs in a container and reaches this over the
# docker bridge, not loopback. `exec` keeps the PID so pm2 can signal it directly.
set -e
cd "$(dirname "$0")"

if [ ! -f dist/index.html ]; then
  echo "dist/index.html missing — run 'npm run build' first" >&2
  exit 1
fi

exec node node_modules/vite/bin/vite.js preview --port 9001 --strictPort --host 0.0.0.0