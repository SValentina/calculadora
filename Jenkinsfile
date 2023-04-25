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
        //contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(replace: "${TITLE}", search: '%TITLE%|dev'), fileContentReplaceItemConfig(replace: "${BUTTON}", search: '%BUTTON%|success')], fileEncoding: 'UTF-8', filePath: "${env.WORKSPACE}"+'/prod/src/environments/environment.ts')])
        sh 'ng build'
      }
    }
        
    stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless'
      }
    }

    stage('Build Docker Image'){
      environment {
        dockerHome = tool 'docker'
      }
      steps{
        //sh "echo 'FROM nginx:1.17.1-alpine \nCOPY dist/app-angular /usr/share/nginx/html' > Dockerfile"
        sh "${dockerHome}/bin/docker build -f Dockerfile.app -t valen97/pruebacalcu ."
      }
    }

    stage('Publish Docker Image'){
      environment {
        dockerHome = tool 'docker'
        dockerHub = credentials('VsDockerHub')
      }
      steps {            
        sh "${dockerHome}/bin/docker login -u $dockerHub_USR -p $dockerHub_PSW"
        sh "${dockerHome}/bin/docker push valen97/calculadora"
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
