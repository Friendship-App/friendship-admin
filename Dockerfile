# Using node alpine version
FROM node:9-alpine
  # Expose port container number
EXPOSE 3000
  # Install tini helper( to remove container after its done)
RUN apk add --update tini
  # Create work dir
RUN mkdir -p /Friendship/Friendship-admin
  # Change to work dir
WORKDIR /Friendship/Friendship-admin
  # Copy JSON file to container
COPY package.json package.json
  # Run yarn to build
RUN yarn
  # Copy from source dir to container
COPY . .
  # Run server
CMD ["tini","--","yarn","start"]

