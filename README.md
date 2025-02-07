# QR Code Generator Cloudflare Worker

This is a Cloudflare Worker that generates QR codes based on user input. It supports both `GET` and `POST` requests for generating QR codes dynamically. The worker can create a QR code from a URL query parameter or form data, and it provides an HTML page for user input if no data is provided in the query.

## Features

- **Generate QR Codes via GET requests**: Users can pass a `data` query parameter to generate a QR code.
- **Support for POST requests**: Users can submit form data to create a QR code.
- **Customizable QR Code Options**: Users can specify the error correction level (`ec`) and version (`version`) of the QR code.
- **Manual Input Page**: When no data is provided, the worker returns an HTML page prompting the user for data to encode.
- **SVG Output**: The QR code is returned as an SVG image.

## Setup and Installation

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/qr-code-worker.git
cd qr-code-worker
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the worker locally:
```bash
npm run dev
```

This will start a local development server at `http://localhost:8787/`. You can test the worker by navigating to this URL in your browser.

### 4. Deploy to Cloudflare:
Once you're happy with the worker, you can deploy it to Cloudflare:
```bash
npm run deploy
```

## Usage

### GET Request

To generate a QR code, make a `GET` request with a `data` query parameter. The response will be an SVG QR code.

#### Example Request:
```http
GET http://localhost:8787/?data=Hello%20World&ec=L&version=5
```

- `data`: The text or URL you want to encode in the QR code.
- `ec` (Optional): The error correction level. Values can be `L`, `M`, `Q`, `H` (default: `M`).
- `version` (Optional): The version of the QR code (default is auto-generated based on the size of the data).

#### Example Response:
An SVG image containing the QR code for the text "Hello World".

### POST Request

To generate a QR code via a `POST` request, send form data with a `text` field containing the data for the QR code.

#### Example Request:
```http
POST http://localhost:8787/
Content-Type: multipart/form-data

text=My%20QR%20Code
```

The worker will redirect you to a `GET` request with the `data` query parameter containing the encoded text.

#### Example Response:
A `301 Moved Permanently` redirect to:
```http
GET http://localhost:8787/?data=My%20QR%20Code
```

### Manual Input Page

If no query parameters are provided, the worker will serve an HTML page prompting the user for a string of data to encode.

---

## Code Explanation

### Imports:
- **QRCode**: The `qrcode` library is used to generate the QR code. It provides various options for customization such as error correction level and version.
- **manual.html**: A static HTML file that allows for the user to input data in a HTML form

### Fetch Event Handler:
The `fetch` event handler processes both `GET` and `POST` requests:
1. **GET Request**: 
   - If the `data` query parameter is provided, it generates a QR code and returns it as an SVG image.
   - If the `ec` (error correction level) or `version` parameters are missing, default values are used.
   - If no `data` is provided, it serves the manual HTML page.
   
2. **POST Request**:
   - The worker accepts a form submission with a `text` field. It processes the form data and redirects the user to a `GET` request with the `data` parameter set to the submitted text.

### Error Handling:
- If the QR code generation fails, the worker returns a `500 Internal Server Error` response with the message "Something went wrong."

---

## Environment Configuration

The worker's configuration, including bindings and type generation, can be managed via the `wrangler.json` file. After adding bindings to the `wrangler.json` file, you can regenerate the type definition for the `Env` object using:

```bash
npm run cf-typegen
```

## Resources
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [QR Code Library (qrcode)](https://www.npmjs.com/package/qrcode)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
