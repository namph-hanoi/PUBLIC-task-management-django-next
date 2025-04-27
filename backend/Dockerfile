FROM python:3.10.2-slim-bullseye as base


ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH="${PYTHONPATH}:/code"

WORKDIR /code

COPY ./backend/requirements.txt .

RUN apt-get update -y && \
    apt-get install -y netcat && \
    pip install --upgrade pip && \
    apt-get install --yes --no-install-recommends \
    curl \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && pip install -r requirements.txt

# resolve the issue on MacOS with psycopg2-binary
RUN pip uninstall psycopg2-binary -y
RUN apt update -y && apt install -y build-essential libpq-dev
RUN pip install psycopg2

COPY ./backend/entrypoint.sh .
RUN chmod +x /code/entrypoint.sh

COPY . .

ENTRYPOINT ["/code/entrypoint.sh"]

# ===

# Development target
FROM base as development
RUN pip install debugpy watchdog
ENV DJANGO_SETTINGS_MODULE=backend.settings.development
ENV ENV='development'
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production target
FROM base as production
ENV DJANGO_SETTINGS_MODULE=backend.settings.production

