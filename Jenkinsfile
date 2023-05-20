pipeline {
  
  agent { dockerfile { args '--privileged --network=host' } }
  
  stages {

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
 
    stage('Build') {
      steps { 
        sh 'ng build'
      }
    }
        
    stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless --code-coverage'
      }
    }

    stage('SonarQube Analysis') {
      environment {
        sonarHome = tool 'sonar-scanner'
        JAVA_HOME = tool 'openjdk-11'
      }
      steps {
        withSonarQubeEnv('sonarqube') {
          sh "sed -i 's/%BUILD_NUMBER%/${BUILD_NUMBER}/g' sonar-project.properties"
          sh "${sonarHome}/bin/sonar-scanner"
        }

      }
    }

    stage('Quality Gate') {
      steps {
        waitForQualityGate true
        echo '--- QualityGate Passed ---'
      }
    }
    
    stage('Build Docker Image'){
      environment {
        dockerHome = tool 'docker'
      }
      steps{
        sh "${dockerHome}/bin/docker build -f Dockerfile.app -t valen97/calculadora-angular:${BUILD_NUMBER} ."
      }
    }

    stage('Publish Docker Image'){
      environment {
        dockerHome = tool 'docker'
        dockerHub = credentials('VsDockerHub')
      }
      steps {            
        sh '${dockerHome}/bin/docker login -u $dockerHub_USR -p $dockerHub_PSW'
        sh '${dockerHome}/bin/docker push valen97/calculadora-angular:${BUILD_NUMBER}'
        sh '${dockerHome}/bin/docker rmi valen97/calculadora-angular:${BUILD_NUMBER}'
        sh '${dockerHome}/bin/docker logout'
      }
    }
  }

  post{
    success {
      build(job: 'calculadora-angular-deploy', 
      parameters: [
        string(name: 'BUILD_NUMBER', value: "${BUILD_NUMBER}")
      ])

      mail to: "valentina_17_01@hotmail.com",
      subject: "EXITOSA ejecución de la pipeline '${JOB_NAME}'",
      body: """
      * Estado de ejecución: ${currentBuild.result}
      * Número de ejecución: ${BUILD_NUMBER}
      * URL para visualizar los logs de la ejecución: ${env.BUILD_URL}"""
    }
    failure{
      mail to: "valentina_17_01@hotmail.com",
      subject: "FALLIDA ejecución de la pipeline '${JOB_NAME}'",
      body: """
      * Estado de ejecución: ${currentBuild.result}
      * Número de ejecución: ${BUILD_NUMBER}
      * URL para visualizar los logs de la ejecución: ${BUILD_URL}"""
    }
  }
}
