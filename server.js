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

'use strict';

const process = require('process'); // Required to mock environment variables

// [START gae_flex_storage_app]
const express = require('express');
const path = require('path');
const compression = require('compression');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const { Storage } = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

const app = express();
app.set('trust proxy', true);

app.use(express.json());

app.use(compression());

if (app.get('env') === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      // request was via http, so redirect to https
      res.redirect('https://' + req.headers.host + req.url);
    }
  });
}

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

async function listFilesPaginated() {
  return await bucket.getFiles({
    autoPaginate: true,
  });
}

app.get('/files', (_req, res) => {
  listFilesPaginated()
    .then((data) => {
      res.json([
        data[0].map((d) => {
          return { id: d.id, name: d.name };
        }),
      ]);
    })
    .catch(console.error);
});

app.use(
  express.static(path.join(__dirname, 'build'), {
    setHeaders: (res, _path) => {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    },
  })
);
app.get('/', function (_req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_storage_app]

module.exports = app;
