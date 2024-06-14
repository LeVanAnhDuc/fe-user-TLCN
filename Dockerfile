FROM node:18-alpine

# create app directory
WORKDIR /usr/src/fe/client

# Copy all files to the workdir
COPY . /usr/src/fe/client

#
# RUN npm install --legacy-peer-deps
RUN npm install

EXPOSE 3001
# Command to run when starting the container
CMD ["npm", "run", "dev", "--", "--host"]
