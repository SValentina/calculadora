FROM timbru31/node-chrome:16-slim

#Install @angular/Cli
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g @angular/cli

#Install Azure-Cli
RUN apt-get update && apt-get install -y \
    ca-certificates curl zip 
CMD /bin/bash
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

#Install Kubectl CLI
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
RUN chmod +x ./kubectl
RUN mv ./kubectl /usr/local/bin