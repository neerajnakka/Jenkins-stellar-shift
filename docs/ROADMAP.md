# CI/CD Hands-on Roadmap

## Phase 1: Application foundation

- Node.js application
- Express
- Unit testing
- Linting
- Health checks
- Configuration
- Git workflow

## Phase 2: Jenkins fundamentals

- Jenkins installation
- Controller and agents
- Executors
- Workspace
- Credentials
- Freestyle jobs
- Pipeline jobs
- Jenkinsfile
- Declarative Pipeline
- Scripted Pipeline

## Phase 3: CI pipeline

- Checkout
- npm ci
- lint
- unit tests
- test reports
- code coverage
- SonarQube
- quality gates
- artifact management

## Phase 4: Container pipeline

- Docker build
- Docker layer caching
- multi-stage builds
- image tagging
- registry authentication
- image push
- Trivy
- SBOM
- image promotion

## Phase 5: CD

- Kubernetes
- Helm
- environment configuration
- deployments
- services
- ingress
- probes
- resource requests and limits
- rollout status
- rollback

## Phase 6: GitOps

- ArgoCD
- GitOps repository
- desired state
- sync
- drift
- rollback

## Phase 7: Jenkins at scale

- agents
- labels
- Docker agents
- Kubernetes agents
- ephemeral workers
- parallel stages
- matrix builds
- shared libraries
- multibranch pipelines
- pipeline optimization

## Phase 8: Security

- Jenkins credentials
- secret handling
- RBAC
- least privilege
- webhook security
- dependency scanning
- SAST
- image scanning
- artifact integrity

## Phase 9: Reliability

- Prometheus
- Grafana
- pipeline metrics
- application metrics
- alerts
- deployment failure
- rollback
- incident response

## Phase 10: Scenario labs

Break the system intentionally and troubleshoot:

- Git checkout failure
- webhook failure
- credentials failure
- npm registry failure
- test failure
- SonarQube quality gate failure
- Docker build failure
- registry authentication failure
- image pull failure
- Kubernetes CrashLoopBackOff
- readiness probe failure
- service connectivity failure
- ingress failure
- failed deployment
- ArgoCD OutOfSync
- Terraform drift
- disk-full condition
- agent unavailable
- queued Jenkins builds
