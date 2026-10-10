# DevOps Node.js CI/CD Lab
 
This repository is the starting point for a hands-on, production-style DevOps learning project.

The goal is to progressively evolve this repository from a simple Node.js service into a complete CI/CD platform involving:

- Git and GitHub
- Jenkins
- Jenkins Pipeline and Jenkinsfile
- Docker
- Container security
- SonarQube
- Container registry
- Kubernetes
- Helm
- Terraform
- ArgoCD / GitOps
- Prometheus and Grafana
- CI/CD security
- Production troubleshooting

## Current stage

This first version contains:

- Node.js + Express application
- Health and readiness endpoints
- Unit tests with Jest
- ESLint
- Dockerfile with multi-stage build
- Non-root container user
- Docker healthcheck
- Docker Compose
- Initial Jenkinsfile
- Makefile
- Environment configuration example

## Requirements

- Node.js 20+
- npm
- Git
- Docker
- Jenkins will be added during the lab

## Run locally

```bash
npm ci
npm test
npm run lint
npm start
```

Open:

```text
http://localhost:3000
http://localhost:3000/health
http://localhost:3000/ready
http://localhost:3000/api/version
```

## Run with Docker

```bash
docker build -t devops-nodejs-cicd-lab:local .
docker run --rm -p 3000:3000 devops-nodejs-cicd-lab:local
```

## Run with Docker Compose

```bash
docker compose up --build
```

## Jenkins

The current Jenkinsfile intentionally starts simple.

We will progressively improve it during the training:

1. Basic pipeline
2. SCM checkout
3. Dependency installation
4. Linting
5. Unit testing
6. Test reports
7. SonarQube
8. Docker build
9. Image tagging
10. Trivy scanning
11. Registry authentication
12. Image push
13. Deployment
14. Environment promotion
15. Approval gates
16. Rollback
17. Notifications
18. Shared libraries
19. Parallel execution
20. Kubernetes-based ephemeral agents

Do not treat the current Jenkinsfile as the final production architecture.


## Suggested Git workflow

```text
main
  |
  +-- feature/*
  |
  +-- bugfix/*
```

Example:

```bash
git checkout -b feature/add-version-endpoint
git add .
git commit -m "feat: add version endpoint"
git push -u origin feature/add-version-endpoint
```

Then create a pull request into `main`.

## Training philosophy

For every CI/CD component we will learn:

1. What it does
2. Why companies use it
3. How it works internally
4. How to implement it
5. How to secure it
6. How to monitor it
7. How it fails
8. How to troubleshoot it
9. How to improve it
10. How to explain it in an interview

The final objective is not to memorize Jenkins syntax. The objective is to understand the engineering decisions behind a production CI/CD system.
