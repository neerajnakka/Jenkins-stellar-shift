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
        APP_NAME = 'devops-nodejs-cicd-lab'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Display Deploy Stage'){
        	steps{
        	echo "Your Selected Environment is : ${params.DEPLOY_ENV}"
        }
      }

        stage('Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
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
                sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."
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
            echo "Pipeline completed: ${currentBuild.currentResult}"
        }
        success {
            echo 'CI pipeline succeeded.'
        }
        failure {
            echo 'CI pipeline failed. Check the stage logs and identify the root cause.'
        }
    }
}
