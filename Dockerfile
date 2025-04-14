FROM node:18

WORKDIR /usr/src/api

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy remaining source code and build the project
COPY . ./
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]

