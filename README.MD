# To Run Locally (without using docker)
`npm i`
`npm run dev`


# Test locally
install wscat globally `npm i -g wscat`
then call it in terminal to connect a websocket to this server `wscat -c ws://localhost:8080`


# To Deploy
Build a docker image
`docker build --tag bb_image_socket .`
(the tag be whatever but it's good to have a descriptive tag)

Find the docker image with
`docker images` and identify the image name

Test it locally with `docker run -p 8080:8080 [image name]`
-p opens up the ports for the local system


Then
`gcloud deploy --image [image name]`