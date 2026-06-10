FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy overlay files (custom screens, services)
COPY overlay/ /overlay/

# Copy and fix entrypoint script (ensure Unix line endings)
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh \
    && chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app

EXPOSE 8081

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
