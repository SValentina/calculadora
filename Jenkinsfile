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
        sh '${dockerHome}/bin/docker logout'
      }
    }

    stage('Deploy Dev') {
      steps {            
        withCredentials(bindings: [azureServicePrincipal('azuredevops_dev')]) {
          sh "sed -i 's/%BUILD_NUMBER%/${BUILD_NUMBER}/g' kubernetes/deployment.yml"
          sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'  
          sh 'az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME'  
          sh 'kubectl apply -k kubernetes/.'        
        }      
      }
    }          
  }

  parameters {
    string(name: 'RESOURCE_GROUP', defaultValue: 'SOCIUSRGLAB-RG-MODELODEVOPS-AKS', description: 'Grupo de Recursos') 
    string(name: 'CLUSTER_NAME', defaultValue: 'ModeloDevOps-AKS', description: 'Nombre del App Service')      
    string(name: 'BUILD_NUMBER', defaultValue: "${BUILD_NUMBER}", description: 'Número de ejecución')      
  }
  
  post{
    success{
      mail to: "svenatain@gmail.com",
      subject: "EXITOSA ejecución de la pipeline '${env.JOB_NAME}'",
      body: """Estado de ejecución: '${currentBuild.result}' <br>
            Número de ejecución: '${env.BUILD_NUMBER}' <br>
            URL de los logs de la ejecución: '${env.BUILD_URL}'"""
    }
    failure{
      mail to: "svenatain@gmail.com",
      subject: "FALLIDA ejecución de la pipeline '${env.JOB_NAME}'",
      body: """Estado de ejecución: '${currentBuild.result}' <br>
            Número de ejecución: '${env.BUILD_NUMBER}' <br>
            URL de los logs de la ejecución: '${env.BUILD_URL}'"""
    }
  }
}
