#!/usr/bin/sh

set -eu

utterance=$1
filename=${2:-$utterance}

echo 'Synthesize "'$utterance'" using gcloud'

gcloud_request_data='{
  "input": {
    "text": "'$utterance'"
  },
  "voice": {
    "languageCode": "ja-JP",
    "name": "ja-JP-Neural2-D"
  },
  "audioConfig": {
    "audioEncoding": "LINEAR16"
  }
}'

curl -X POST -H "Content-Type: application/json" \
-H "X-Goog-User-Project: $(gcloud config list --format='value(core.project)')" \
-H "Authorization: Bearer $(gcloud auth print-access-token)" \
--data "$gcloud_request_data" "https://texttospeech.googleapis.com/v1/text:synthesize" | jq -r '.audioContent' | base64 --decode > "${filename}.wav"

echo Encode "${filename}.wav" to "${filename}.mp3"

ffmpeg -i "${filename}.wav" "${filename}.mp3"
