// Copyright 2016 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

const process = require("process"); // Required to mock environment variables

// [START gae_flex_storage_app]
const { format } = require("util");
const express = require("express");
const path = require("path");
const Multer = require("multer");
const bodyParser = require("body-parser");
const compression = require("compression");

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Storage } = require("@google-cloud/storage");

// Instantiate a storage client
const storage = new Storage();

const app = express();
app.set("trust proxy", true);

app.use(bodyParser.json());

app.use(compression());

if (app.get("env") === "production") {
    app.use(function (req, res, next) {
        if (req.secure) {
            // request was via https, so do no special handling
            next();
        } else {
            // request was via http, so redirect to https
            res.redirect("https://" + req.headers.host + req.url);
        }
    });
}

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Display a form for uploading files.
// app.get("/", (req, res) => {
//     res.render("form.pug");
// });

async function listFilesPaginated() {
    return await bucket.getFiles({
        autoPaginate: true,
    });
}

app.get("/files", (req, res) => {
    listFilesPaginated()
        .then((data) => {
            // console.log(data);
            res.json([
                data[0].map((d) => {
                    return { id: d.id, name: d.name };
                }),
            ]);
        })
        .catch(console.error);
});

// Process the file upload and upload to Google Cloud Storage.
// app.post("/upload", multer.single("file"), (req, res, next) => {
//     if (!req.file) {
//         res.status(400).send("No file uploaded.");
//         return;
//     }

//     // Create a new blob in the bucket and upload the file data.
//     const blob = bucket.file(req.file.originalname);
//     const blobStream = blob.createWriteStream();

//     blobStream.on("error", (err) => {
//         next(err);
//     });

//     blobStream.on("finish", () => {
//         // The public URL can be used to directly access the file via HTTP.
//         const publicUrl = format(
//             `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//         );
//         res.status(200).send(publicUrl);
//     });

//     blobStream.end(req.file.buffer);
// });

app.use(
    express.static(path.join(__dirname, "build"), {
        setHeaders: (res, path) => {
            // if (path.endsWith("sitemap.xml")) {
            res.setHeader("X-Robots-Tag", "noindex, nofollow");
            // }
        },
    })
);
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log("Press Ctrl+C to quit.");
});
// [END gae_flex_storage_app]

module.exports = app;