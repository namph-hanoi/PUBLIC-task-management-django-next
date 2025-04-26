FROM python:3.10.2-slim-bullseye as base


ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

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

