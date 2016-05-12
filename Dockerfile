FROM node:slim

RUN mkdir -p /omp
WORKDIR /omp

# Install app dependencies
COPY ./package.json ./package.json
RUN npm install
RUN rm ./package.json

# The rest of the code will be mounted as a volume

CMD ["npm start"]
