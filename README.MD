# To Run Locally (without using docker)
`npm i`
`npm run dev`

Make sure to point the frontend app to this websocket address

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

Then create an artifact repository in Google Cloud for this. You can do this from the console.

Then upload the docker image to the artifact:
`gcloud builds submit --region=us-central1 --tag us-central1-docker.pkg.dev/[project name]/[repository name]/[desired name for you image]:[tag]`
E.g.
`gcloud builds submit --region=us-central1 --tag us-central1-docker.pkg.dev/bitsandbots/bits-and-bots-socket/socket-image:latest`

Finally, deploy to Google Cloud Run. You can also do this from Google Cloud Console. Find the image in the artifact repository.

# To Test live
Run ws cat against the cloud run service 
`wscat -c wss://[application path]`
e.g.
`wscat -c wss://socket-image-lkjcclx3ma-uc.a.run.app`    