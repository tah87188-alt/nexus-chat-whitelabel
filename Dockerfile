FROM node:18-slim
RUN apt-get update && apt-get install -y chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app
RUN npm install -g @open-wa/wa-automate
COPY workflow.json /app/workflow.json
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PORT=3000
EXPOSE 3000
CMD ["npx", "@open-wa/wa-automate", "--workflow", "/app/workflow.json", "--port", "3000", "--host", "0.0.0.0"]
