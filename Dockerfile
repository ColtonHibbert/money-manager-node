FROM node:14.15.1

WORKDIR /usr/src/money-manager-node

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]