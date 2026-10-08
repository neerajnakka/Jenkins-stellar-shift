install:
	npm ci

test:
	npm test

lint:
	npm run lint

build:
	npm run build

docker-build:
	docker build -t devops-nodejs-cicd-lab:local .

docker-run:
	docker run --rm -p 3000:3000 devops-nodejs-cicd-lab:local

compose-up:
	docker compose up --build

compose-down:
	docker compose down
