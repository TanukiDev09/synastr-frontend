#!/bin/bash

# Vercel Ignored Build Step
# This script determines whether Vercel should build this deployment.
# Exit code 1 = Don't build (ignore)
# Exit code 0 = Build

echo "🔍 Checking if deployment should proceed..."
echo "Current branch: $VERCEL_GIT_COMMIT_REF"

# Only deploy on main branch
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  echo "✅ Building: This is the main branch"
  exit 0
else
  echo "⏭️  Skipping: Only main branch triggers deployment"
  echo "   Branch '$VERCEL_GIT_COMMIT_REF' is ignored"
  exit 1
fi
