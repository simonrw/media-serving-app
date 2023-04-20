#!/usr/bin/env python

import argparse
import boto3
from pathlib import Path
from mypy_boto3_s3 import S3Client
from typing import cast

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-b", "--bucket")
    parser.add_argument("-k", "--key")
    parser.add_argument("source", type=Path)
    args = parser.parse_args()

    client = cast(
        S3Client,
        boto3.client("s3", endpoint_url="http://localhost.localstack.cloud:4566"),
    )

    root: Path = args.source
    for file in root.glob("**/*"):
        if not file.is_file():
            continue
        if not ("stream_" in str(file) or "m3u8" in str(file)):
            continue

        relpath = file.relative_to(root)
        full_key = f"{args.key}/{relpath}"

        print(str(relpath))
        with file.open("rb") as infile:
            client.put_object(Bucket=args.bucket, Key=full_key, Body=infile)
