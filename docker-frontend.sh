docker stop frontend-dev 2>/dev/null || true
docker rm frontend-dev 2>/dev/null || true
docker run -d -p 8080:8080 -v $(pwd)/frontend:/app -v /app/node_modules --name frontend-dev frontend-dev
docker logs -f frontend-dev