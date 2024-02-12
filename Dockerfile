FROM node:20

COPY . /BlogBackEnd
WORKDIR /BlogBackEnd

RUN npm ci
RUN npm run build

CMD node dist/Index.js