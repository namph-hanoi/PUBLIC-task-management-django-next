cp .env.example .env && docker compose down && docker compose up -d --build

docker-compose up -d --build

docker compose exec backend sh -c "DJANGO_SETTINGS_MODULE=config.settings.test pytest"