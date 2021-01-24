## TODO
* Consider setting up a google Cloud Run pipeline to automatically downsize large images.
  * https://cloud.google.com/run/docs/tutorials/image-processing

## Structure
* Images are stored in GCP Storage bucket
* App is hosted on GCP App Engine
* Uses an Express server to create routes for getting image metadata and serve the React client app
* React client app presents the images in a gallery.

## Storage
Set the default sharing policy to public:
`gsutil defacl set public-read gs://[YOUR_BUCKET_NAME]`
## Local Dev
When running locally, you can use the [Google Cloud SDK](https://cloud.google.com/sdk)
to provide authentication to use Google Cloud APIs:

    gcloud init

Then set environment variables before starting your application:

    //`gcloud config set project my-project`
    export GOOGLE_CLOUD_PROJECT=<your-project-id>
    export GCLOUD_STORAGE_BUCKET=<your-bucket-name>
    npm install
    npm start

## Deploy
Then build locally before deploying:

    npm run-script build
    gcloud app deploy

## Images
Images are stored on Google Cloud storage in a bucket. Multiple buckets are used for performant images.
