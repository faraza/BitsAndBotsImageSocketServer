# To Deploy
Build a docker image
`docker build --tag bb_image_socket .`
(the tag be whatever but it's good to have a descriptive tag)

Find the docker image with
`docker image` and identify the image name

Then
`gcloud deploy --image [image name]`