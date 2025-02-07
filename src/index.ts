/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.json`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import QRCode from "qrcode"
import manual from "./manual.html"

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)
		if (url.searchParams.get("data")) {
			// console.log("there is a query!")
			const data = url.searchParams.get("data") ?? "error parsing data"
			const ec = url.searchParams.get("ec") ?? "M"
			const version = url.searchParams.get("version")
			try {
				var code = await QRCode.toString(data, { 'errorCorrectionLevel' : ec , 'version' : version})
			} catch {
				return new Response('Something went wrong.', {'status' : 500})
			}
			return new Response(code, { headers: { 'content-type' : 'image/svg+xml'}})
		}
		else {
			if(request.method == "POST") {
				const textInput = await request.formData()
				const data = textInput.get("text")?.toString() || "Invalid data"
				// console.log(data)
				var redirectUrl = String(request.url + "?data=" + data)
				return new Response("OK", { 'status' : 301, headers: { 'location' : redirectUrl}})
			}
			return new Response(manual, { headers: { 'content-type' : 'text/html'}})
		}
	},
} satisfies ExportedHandler<Env>;
