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

RUN curl -fsSLo /etc/apt/keyrings/kubernetes-archive-keyring.gpg https://packages.cloud.google.com/apt/doc/apt-key.gpg \
    echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list \
    sudo apt-get update \
    sudo apt-get install -y kubectl