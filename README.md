# Cloudinary Upload example
This example shows how to upload images to the [Cloudinary](https://cloudinary.com/) cloud service.


## Cloud architecture
It's easy to store strings and numbers, not so much doing the same with images as they are [binary data](https://en.wikipedia.org/wiki/Binary_file).

One could upload them to the `public` folder of the next project and make them available like other public assets. This would lead to multiple problems, namely:

- the project filesystem is volatile, gets recreated on every Vercel deployment and the files would be deleted;
- even so, having a single server for images, api and the React app may overload the whole thing.

Relying on a third party service is a good solution.

## Registering to Cloudinary

1. Signup at [Cloudinary](https://cloudinary.com/).

2. Once you are in, note down the **Cloud Name, API Key and API Secret** from the [console](https://console.cloudinary.com/console).

![Cloudinary Dashboard](/public/cloudinary-dashboard.png)


## Setting Up Cloudinary

Before integrating Cloudinary into your application, you need to set up an account and configure your environment:

1. Create a Cloudinary Account
- Sign up at [Cloudinary](https://cloudinary.com/).
- Once signed in, take note of your Cloud Name from the dashboard.
  
2. Configure Upload Settings
- Navigate to the settings page, then to the `Upload` tab.
- Change the `ml_default` signing mode to `Unsigned` for simplicity in this example.

---

## Setting up the project

### .env.local

-create an `.env.local` file based on the example below

```env
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
```

>💡 Ensure these values are securely stored and not exposed in your repository - keep the `.gitignore` file in mind. 

>💡 For Next.js applications deployed on Vercel, you should set these in the project settings under "Environment Variables" as well. For more details on using environment variables in Vercel, you can refer to [Vercel's documentation](https://vercel.com/docs/projects/environment-variables).

>💡 You can also consider adding the Cloudinary environment variables to an `.env.example` as this serves as a template and guide for developers and helps them understand which environment variables are required to run the project correctly.


### Install dependencies

To securely upload files, we utilize Node.js modules for backend operations. This approach ensures sensitive information, such as our `CLOUDINARY_SECRET`, remains confidential and not exposed.

Therefore, we need to install two dependencies that help us implement an upload to our application:

-  [cloudinary](https://www.npmjs.com/package/cloudinary): `npm install cloudinary`
-  [formidable](https://www.npmjs.com/package/formidable): `npm install formidable`


>💡 formidable is a Node.js module for parsing form data, especially file uploads.

---

## Implementing basic image upload

### Add a form and get its data

- In `/pages/index.js` (or whichever component/page will return your image upload form) add a `form` with `input` (type="file"), `label` and `button`.
- Write a `handleSubmit` that extracts the data from the form and sends it as a POST request to our upload API route.

```js
async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
}
```

- Note how we do not use `JSON.stringify()` on our formData, since we send a file (which is binary data).
- Make sure the `handleSubmit` is being called whenever the form is being submitted.

>💡 The example is streamlined for simplicity, focusing on the file upload functionality. In a real-world application, your form might include additional fields such as text inputs, selects, checkboxes, etc., depending on the data you wish to collect alongside the image.


### Write API Route and send image file to Cloudinary

- Create an API Route for our uploads to be handled (e.g. `/pages/api/upload/index.js`).
- We need to import cloudinary as well as formidable and some configuration at the top level of our API Route

- Imports:

```js
import formidable from "formidable";
import cloudinary from "cloudinary";
```

- Cloudinary config:

```js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
```

- API Route config:

```js
export const config = {
  api: {
    bodyParser: false,
  },
};
```

>💡 This setting disables the built-in body parser. By default, Next.js automatically parses the incoming request bodies in API routes. This is useful for POST requests where you need to access the data sent by the client in the body of the request. However, there are cases where you might want to handle the parsing yourself or use a different library to do so. In our case, we use the library "formidable" to achieve this.

- Write a handler function that uses formidable to parse the request object and use that data to send our image file to Cloudinary.

```js
export default async function handler(request, response) {
  // ensure this route can only be used for POST requests
  if (request.method !== "POST") {
    return response.status(400).json({ message: "Method not allowed" });
  }

   // we initialize formidable with an empty options object
  const form = formidable({});

  // we have access to a .parse() method that allows us to access the fields
  // and more importantly the files
  const [fields, files] = await form.parse(request);

 // refers to the first file in the array of files uploaded through the form input with the "name "attribute set to "image".
  const file = files.image[0];

  const { newFilename, filepath } = file;

  // now we have the information about the image, we can send it to Cloudinary
  const result = await cloudinary.v2.uploader.upload(filepath, {
    public_id: newFilename,
    folder: "nf",
  });
  /*
  To upload a file, we call the upload method with the file's path. 
  Additionally, we can provide an optional configuration object:
  - 'public_id' allows us to specify a custom identifier for the uploaded file.
  - 'folder' lets us designate a specific folder within Cloudinary where the file should be stored.
  */

  response.status(200).json(result);
}
```

In the code snippet above, we have access to a "result" which contains the returned information from Cloudinary. With this object we can proceed to our liking: 

- We can send it back as a whole to the frontend, which is what we are doing in this example.

- We could also save the newly created image url to our database, in case we have one. 