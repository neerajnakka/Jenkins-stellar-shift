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
            environment {
                AWS_REGION = 'ap-southeast-2'
                ECR_REPOSITORY = 'devops-nodejs-cicd-lab'
            }
            steps {
                sh '''
                    set -eu
        
                    AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
                        --query Account --output text)
        
                    ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${BUILD_NUMBER}"
        
                    aws ecr get-login-password --region "$AWS_REGION" |
                        docker login --username AWS --password-stdin "$ECR_REGISTRY"
        
                    docker tag "${APP_NAME}:${BUILD_NUMBER}" "$IMAGE_URI"
                    docker push "$IMAGE_URI"
                    docker logout "$ECR_REGISTRY"
        
                    echo "Image pushed to Amazon ECR"
                '''
            }
        }

        stage('Docker Image Deploy') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PWD'
                    )
                ]) {
                    sh '''
                        set +x
                        IMAGE="$DOCKERHUB_USER/$APP_NAME:$BUILD_NUMBER"

                        printf '%s' "$DOCKERHUB_PWD" |
                            docker login --username "$DOCKERHUB_USER" --password-stdin

                        docker tag "$APP_NAME:$BUILD_NUMBER" "$IMAGE"
                        docker push "$IMAGE"
                        docker logout
                    '''
                }
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
