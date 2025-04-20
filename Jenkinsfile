// pipeline {
//     agent any

//     tools {
//         nodejs 'NodeJS' // This should match the name set in Global Tool Config
//     }

//     environment {
//         APP_NAME = 'ChatApp'
//     }

//     stages {
//         stage('Clone Repo') {
//             steps {
//                 git 'https://github.com/ankur0704/chatapp.git'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                bat 'npm install'
//             }
//         }

//         stage('Lint & Test') {
//             steps {
//                 // Optional: If you have ESLint or test scripts
//                 echo 'Running linter or tests (if configured)...'
//                 // sh 'npm run lint'
//                 // sh 'npm test'
//             }
//         }

//         stage('Build') {
//             steps {
//                 echo 'No build step needed for Node.js app, continuing...'
//             }
//         }

//         stage('Deploy') {
//             steps {
//                 echo 'Deploying to server...'
//                 // Replace this with actual deploy step, like:
//                 // sh 'scp -r * user@server:/path/to/deploy'
//                 // Or docker build + push
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Pipeline completed successfully.'
//         }
//         failure {
//             echo 'Pipeline failed.'
//         }
//     }
// }


pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ankur0704/chatapp.git', 
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('src') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('src') {
                    bat 'npm run build'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('server') {
                    bat 'npm install'
                }
            }
        }

        stage('Start Backend Server') {
            steps {
                dir('server') {
                    bat 'npm run server &'
                }
            }
        }

        stage('Start Frontend Server') {
            steps {
                dir('src') {
                    bat 'npm run dev &'
                }
            }
        }
    }

    post {
        success {
            echo 'Application has been built and started successfully.'
        }
        failure {
            echo 'Build failed. Please check the logs for details.'
        }
    }
}
