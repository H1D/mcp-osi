#!/bin/bash
cd "$(dirname "$0")"
git pull -q 2>/dev/null
npm install -q --no-audit --no-fund 2>/dev/null
exec node dist/index.js
