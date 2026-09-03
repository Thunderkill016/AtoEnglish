FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models/huggingface

RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg espeak-ng ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the CPU PyTorch wheel first so the container does not accidentally pull CUDA packages.
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY app.py ./

RUN mkdir -p /models/huggingface

EXPOSE 8000

# Railway injects PORT; local Docker and other hosts can fall back to 8000.
CMD ["sh", "-c", "exec uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000} --no-access-log"]
