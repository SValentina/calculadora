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
        sh "${dockerHome}/bin/docker build -f Dockerfile.app -t valen97/calculadora-angular ."
      }
    }

    stage('Publish Docker Image'){
      environment {
        dockerHome = tool 'docker'
        dockerHub = credentials('VsDockerHub')
      }
      steps {            
        sh "${dockerHome}/bin/docker login -u $dockerHub_USR -p $dockerHub_PSW"
        sh "${dockerHome}/bin/docker push valen97/calculadora-angular"
        sh "${dockerHome}/bin/docker logout"
      }
    }

    stage('Deploy Dev') {
      steps {            
        withCredentials(bindings: [azureServicePrincipal('azuredevops_dev')]) {
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
  }
}
