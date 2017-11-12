#!/bin/bash
source apikey.secret
web-ext sign --api-key=$API_KEY --api-secret=$API_SECRET --source-dir "src" --ignore-files "LICENSE"
