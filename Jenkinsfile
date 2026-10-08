pipeline {
    agent any
	options {
    	skipDefaultCheckout(true)
	}
	    environment {
        APP_NAME = "devops-nodejs-cicd-lab"
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Environment") {
            steps {
                sh "node --version"
                sh "npm --version"
            }
        }

        stage("Install Dependencies") {
            steps {
                sh "npm ci"
            }
        }

        stage("Lint") {
            steps {
                sh "npm run lint"
            }
        }

        stage("Unit Tests") {
            steps {
                sh "npm test"
            }
        }

        stage("Build") {
            steps {
                sh "npm run build"
            }
        }

        stage("Docker Build") {
            steps {
                sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."
            }
        }
    }

    post {
        always {
            echo "Pipeline completed: ${currentBuild.currentResult}"
        }

        success {
            echo "CI pipeline succeeded."
        }

        failure {
            echo "CI pipeline failed. Check the stage logs and identify the root cause."
        }
    }
}
