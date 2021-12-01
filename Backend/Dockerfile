FROM node
COPY . /
RUN npm install
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD [ "npm", "run", "start" ]