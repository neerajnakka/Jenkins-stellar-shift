pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(
            numToKeepStr: '10',
            daysToKeepStr: '30',
            artifactNumToKeepStr: '5',
            artifactDaysToKeepStr: '14'
        ))
    }

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['DEV', 'STAGING', 'PROD'],
            description: 'Choose the environment for this pipeline'
        )
    }

    environment {
        DEMO_API_TOKEN = credentials('demo-api-token')
        APP_NAME = 'devops-nodejs-cicd-lab'
        AWS_REGION = 'ap-southeast-2'
        ECR_REPOSITORY = 'devops-nodejs-cicd-lab'
        ECS_CLUSTER = 'nodejs-cicd-cluster'
        ECS_SERVICE = 'nodejs-cicd-service'
        TASK_FAMILY = 'nodejs-cicd-task'
        CONTAINER_NAME = 'nodejs-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Display Deploy Stage') {
            steps {
                echo "Your selected environment is: ${params.DEPLOY_ENV}"
            }
        }

        stage('Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Verify Credential Binding') {
            steps {
                sh 'test -n "$DEMO_API_TOKEN" && echo "Credential binding successful"'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t "$APP_NAME:$BUILD_NUMBER" .'
            }
        }

        stage('Production Approval') {
            when {
                expression { params.DEPLOY_ENV == 'PROD' }
            }
            steps {
                input message: 'Approve production deployment?',
                      ok: 'Approve'
            }
        }
        
      
        

        stage('Push to Amazon ECR') {
            steps {
                sh '''
set -eu

AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
    --query Account --output text \
    --region "$AWS_REGION")

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"

ECR_PASSWORD=$(aws ecr get-login-password --region "$AWS_REGION")
printf '%s' "$ECR_PASSWORD" |
    docker login --username AWS --password-stdin "$ECR_REGISTRY"

docker tag "${APP_NAME}:${BUILD_NUMBER}" "$IMAGE_URI"
docker push "$IMAGE_URI"
docker logout "$ECR_REGISTRY"

echo "Image pushed to Amazon ECR: $IMAGE_URI"
'''
            }
        }

        stage('When Production') {
            when {
                expression { params.DEPLOY_ENV == 'PROD' }
            }
            steps {
                echo 'Production workflow'
            }
        }

        stage('When Non-Production') {
            when {
                expression { params.DEPLOY_ENV != 'PROD' }
            }
            steps {
                echo 'Non-production workflow'
            }
        }

        stage('Main or Release Branch') {
            when {
                anyOf {
                    branch 'main'
                    branch 'release'
                }
            }
            steps {
                echo "Branch is ${env.BRANCH_NAME}"
            }
        }

        stage('Deploy to ECS Fargate') {
            steps {
                sh '''
set -eu

AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
    --query Account --output text \
    --region "$AWS_REGION")

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"
export IMAGE_URI CONTAINER_NAME

echo "Preparing ECS deployment for ${IMAGE_URI}"

aws ecs describe-task-definition \
    --task-definition "$TASK_FAMILY" \
    --region "$AWS_REGION" \
    --query taskDefinition \
    --output json > task-definition-current.json

python3 - <<'PY'
import json
import os

with open("task-definition-current.json", encoding="utf-8") as f:
    task = json.load(f)

# Remove response-only fields that RegisterTaskDefinition does not accept.
for key in [
    "taskDefinitionArn",
    "revision",
    "status",
    "requiresAttributes",
    "compatibilities",
    "registeredAt",
    "registeredBy",
    "deregisteredAt",
]:
    task.pop(key, None)

container_name = os.environ["CONTAINER_NAME"]
image_uri = os.environ["IMAGE_URI"]
found = False


for container in task["containerDefinitions"]:
    if container["name"] == container_name:
        container["image"] = image_uri

        container["healthCheck"] = {
            "command": [
                "CMD-SHELL",
                "wget --no-verbose --tries=1 --spider "
                "http://127.0.0.1:3000/health || exit 1"
            ],
            "interval": 30,
            "timeout": 5,
            "retries": 3,
            "startPeriod": 10
        }

        found = True


if not found:
    raise SystemExit(
        f"Container {container_name!r} not found in task definition"
    )

with open("task-definition-new.json", "w", encoding="utf-8") as f:
    json.dump(task, f)

print(f"Prepared task definition with image: {image_uri}")
PY

NEW_TASK_DEF_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://task-definition-new.json \
    --region "$AWS_REGION" \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)

echo "Registered task definition: ${NEW_TASK_DEF_ARN}"

aws ecs update-service \
    --cluster "$ECS_CLUSTER" \
    --service "$ECS_SERVICE" \
    --task-definition "$NEW_TASK_DEF_ARN" \
    --region "$AWS_REGION"

echo "Waiting for ECS service to stabilize..."

aws ecs wait services-stable \
    --cluster "$ECS_CLUSTER" \
    --services "$ECS_SERVICE" \
    --region "$AWS_REGION"

echo "ECS deployment completed successfully."
'''
            }
        }
    }

    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"

            junit(
                testResults: 'reports/junit.xml',
                allowEmptyResults: true
            )

            archiveArtifacts(
                artifacts: 'Dockerfile,package.json,package-lock.json,reports/junit.xml',
                allowEmptyArchive: true,
                fingerprint: true
            )

            deleteDir()
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
