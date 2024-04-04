# Cloudinary Upload example
This example shows how to upload images to the [Cloudinary](https://cloudinary.com/) cloud service.


## Cloud architecture
It's easy to store strings and numbers into a MongoDB database, not so much doing the same with images as they are [binary data](https://en.wikipedia.org/wiki/Binary_file).

One could upload them to the public folder of the next project and make them available like other public assets. This would lead to multiple problems, namely:

- the project filesystem is volatile, gets recreated on every Vercel deployment and the files would be deleted;
- even so, having a single server for images, api and the React app may overload the whole thing.

Relying on a third party service is a good solution.

## Registering to Cloudinary

- Signup at [Cloudinary](https://cloudinary.com/) first.
- Once you are in, note down the Cloud Name from the console:
  Note: image
- Then go to the settings page, into the Upload section, and edit the `ml_default` signing mode to Unsigned:
-  Note: image


## Configuring Cloudinary for the browser
Add a `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` variable in your `.env.local` file with the cloud name you registered from your Cloudinary Dashboard.

[This will expose the variable in your frontend code](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser), like:

```js
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
``