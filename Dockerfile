FROM node:alpine
WORKDIR /latimes
ADD . /latimes
RUN npm install
ENTRYPOINT ["node"]
CMD ["app.js"]