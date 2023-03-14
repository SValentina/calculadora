pipeline {
  
  agent { dockerfile { args '--privileged --network=host' } }
  
  stages {

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Build') {
      environment{
        TITLE = 'prod'
        BUTTON = 'danger'
      }
      steps {
        //contentReplace(configs: [fileContentReplaceConfig(configs: [fileContentReplaceItemConfig(replace: "${TITLE}", search: '%TITLE%|dev'), fileContentReplaceItemConfig(replace: "${BUTTON}", search: '%BUTTON%|success')], fileEncoding: 'UTF-8', filePath: "${env.WORKSPACE}"+'/prod/src/environments/environment.ts')])
        sh 'ng build --configuration ${ENV_PROD}'
      }
    }
        
    stage('Test') {
      steps {
        sh 'ng test --browsers ChromeHeadless'
        //sleep(time: 90, unit: 'SECONDS')
      }
    }

    stage('Build Docker Image'){
      environment {
        dockerHome = tool 'docker'
      }
      steps{
        sh "echo 'FROM nginx:1.17.1-alpine \nCOPY dist/app-angular /usr/share/nginx/html' > Dockerfile"
        sh "${dockerHome}/bin/docker build -t valen97/calculadora ."
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
        withCredentials(bindings: [azureServicePrincipal('prodServicePrincipal')]) {
          sh 'az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID'  
          sh 'az webapp create -n $APP_NAME_PROD -p $PLAN_NAME  -g $RESOURCE_GROUP_PROD -i valen97/calculadora'
        }      
      }
    }          
  }

  parameters {
    string(name: 'ENV_PROD', defaultValue: 'production', description: 'Nombre del entorno de producción')
    string(name: 'RESOURCE_GROUP', defaultValue: 'SOCIUSRGLAB-RG-MODELODEVOPS-PROD', description: 'Grupo de Recursos') 
    string(name: 'APP_NAME', defaultValue: 'sociuswebapptest006p', description: 'Nombre del App Service')  
    string(name: 'PLAN_NAME', defaultValue: 'Plan-SociusRGLABRGModeloDevOpsDockerProd', description: 'Plan del App Service')   
  }
}
