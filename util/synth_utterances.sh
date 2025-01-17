#!/bin/sh

set -eu

./gcloud_synth_utterance.sh 'Hanmi handachiwaza' hanmi_handachiwaza
./gcloud_synth_utterance.sh Suwariwaza suwariwaza
./gcloud_synth_utterance.sh Ushirowaza ushirowaza

./gcloud_synth_utterance.sh 'Aihanmi katatedori' aihanmi_katatedori
./gcloud_synth_utterance.sh 'Chudan tsuki' chudan_tsuki
./gcloud_synth_utterance.sh 'Jodan tsuki' jodan_tsuki
./gcloud_synth_utterance.sh Katadori katadori
./gcloud_synth_utterance.sh Katatedori katatedori
./gcloud_synth_utterance.sh Katateryotedori katateryotedori
./gcloud_synth_utterance.sh Ryotedori ryotedori
./gcloud_synth_utterance.sh Shomenuchi shomenuchi
./gcloud_synth_utterance.sh Yokomenuchi yokomenuchi

./gcloud_synth_utterance.sh 五教 gokyo
./gcloud_synth_utterance.sh Ikkyo ikkyo
./gcloud_synth_utterance.sh Iriminage iriminage
./gcloud_synth_utterance.sh Jiyuwaza jiyuwaza
./gcloud_synth_utterance.sh Kokyuho kokyuho
./gcloud_synth_utterance.sh Kotegaeshi kotegaeshi
./gcloud_synth_utterance.sh 二教 nikyo
./gcloud_synth_utterance.sh 三教 sankyo
./gcloud_synth_utterance.sh Shihonage shihonage
./gcloud_synth_utterance.sh Sotokaitennage sotokaitennage
./gcloud_synth_utterance.sh Tenchinage tenchinage
./gcloud_synth_utterance.sh Uchikaitennage uchikaitennage
./gcloud_synth_utterance.sh Yonkyo yonkyo


