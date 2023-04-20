#!/usr/bin/env python

import argparse
import boto3
from pathlib import Path
from mypy_boto3_s3 import S3Client
from concurrent.futures import ThreadPoolExecutor
from typing import cast, Iterable


def upload_in_parallel(
    files: Iterable[Path], root: Path, client: S3Client, key: str, bucket: str
) -> None:
    def upload(file: Path):
        if not file.is_file():
            return
        if not ("stream_" in str(file) or "m3u8" in str(file)):
            return

        relpath = file.relative_to(root)
        full_key = f"{key}/{relpath}"

        print(str(relpath))
        with file.open("rb") as infile:
            client.put_object(Bucket=bucket, Key=full_key, Body=infile)

    with ThreadPoolExecutor() as pool:
        list(pool.map(upload, files))


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
    files = root.glob("**/*")
    upload_in_parallel(files, root, client, args.key, args.bucket)
