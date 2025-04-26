FROM postgres:latest

# # Set environment variables (will be overridden by compose.yml if provided there)
# ENV DB_USERNAME=postgres
# ENV DB_PASSWORD=postgres
# ENV DB_NAME=postgres

# Standard PostgreSQL environment variables that the postgres image expects
ENV POSTGRES_USER=${DB_USERNAME}
ENV POSTGRES_PASSWORD=${DB_PASSWORD}
ENV POSTGRES_DB=${DB_NAME}

# Copy initialization scripts
COPY ./init-scripts/ /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/01-init-db.sh
# Copy custom PostgreSQL configuration
COPY ./postgresql.conf /etc/postgresql/postgresql.conf
COPY ./pg_hba.conf /etc/postgresql/pg_hba.conf

# Set configuration file path
ENV POSTGRES_INITDB_ARGS="-c config_file=/etc/postgresql/postgresql.conf -c hba_file=/etc/postgresql/pg_hba.conf"
# Expose PostgreSQL port
EXPOSE 5432

# The postgres image automatically creates a volume at /var/lib/postgresql/data
