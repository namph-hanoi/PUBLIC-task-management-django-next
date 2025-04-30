#!/bin/sh

echo 'Waiting for postgres...'

while ! nc -z $DB_HOSTNAME $DB_PORT; do
    sleep 0.1
done

echo 'PostgreSQL started'

echo 'Running migrations...'
python manage.py migrate

echo 'Collecting static files...'
python manage.py collectstatic --no-input

if [ "$ENV" = "development" ]; then
    python manage.py runserver 0.0.0.0:8000
else
    gunicorn backend.wsgi:application \
        --bind 0.0.0.0:8000 \
        --worker-class uvicorn.workers.UvicornWorker \
        --workers $(nproc) \
        --log-level=info
fi

# exec "$@"
