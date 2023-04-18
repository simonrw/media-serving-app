#!/usr/bin/env bash

set -euo pipefail

MOVIE_URL=https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4
MOVIE_PATH=bunny.mp4
OUTPUT_PATH=out.mp4

fetch_raw_movie() {
    if [ ! -f "$MOVIE_PATH" ]; then
        curl -Lo "$MOVIE_PATH" "${MOVIE_URL}"
    fi
}

transcode_movie() {
    ffmpeg -i "$MOVIE_PATH" \
        -filter_complex \
        "[0:v]split=3[v1][v2][v3]; \
        [v1]copy[v1out]; [v2]scale=w=1280:h=720[v2out]; [v3]scale=w=640:h=360[v3out]" \
        -map [v1out] -c:v:0 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:0 5M -maxrate:v:0 5M -minrate:v:0 5M -bufsize:v:0 10M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
        -map [v2out] -c:v:1 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:1 3M -maxrate:v:1 3M -minrate:v:1 3M -bufsize:v:1 3M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
        -map [v3out] -c:v:2 libx264 -x264-params "nal-hrd=cbr:force-cfr=1" -b:v:2 1M -maxrate:v:2 1M -minrate:v:2 1M -bufsize:v:2 1M -preset slow -g 48 -sc_threshold 0 -keyint_min 48 \
        -map a:0 -c:a:0 aac -b:a:0 96k -ac 2 \
        -map a:0 -c:a:1 aac -b:a:1 96k -ac 2 \
        -map a:0 -c:a:2 aac -b:a:2 48k -ac 2 \
        -f hls \
        -hls_time 2 \
        -hls_playlist_type vod \
        -hls_flags independent_segments \
        -hls_segment_type mpegts \
        -hls_segment_filename stream_%v/data%02d.ts \
        -master_pl_name master.m3u8 \
        -var_stream_map "v:0,a:0 v:1,a:1 v:2,a:2" stream_%v.m3u8
}

postprocess() {
    for stream_dir in stream_0 stream_1 stream_2; do
        sed -i "s#data#$stream_dir/data#" "${stream_dir}.m3u8"
    done
}

clean() {
    find . -type f | grep -v package.sh | grep -v $MOVIE_PATH | grep -v .gitignore while read file_path; do
        rm -rf $file_path;
    done || true
}

main() {
    fetch_raw_movie
    clean
    transcode_movie
    postprocess
}

main
