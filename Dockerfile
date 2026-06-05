FROM ghcr.io/open-wa/wa-automate:latest

WORKDIR /app

COPY workflow.json /app/workflow.json

ENV WORKFLOW_PATH=/app/workflow.json

EXPOSE 3000

CMD ["npx", "wa-automate", "--workflow", "/app/workflow.json", "--port", "3000"]
