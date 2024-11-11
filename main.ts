import puppeteer from "npm:puppeteer";
const image: Uint8Array[] = [];
Deno.serve({ port: 3001 }, (request) => {
  const index = Number(new URL(request.url).searchParams.get("index"));
  console.log(index,image.length);
  const status = index < image.length - 1 ? 200 : 204;
  const img = index < image.length - 1 ? image[index] : null
  return new Response(img, {
    headers: {
      "content-type": "image/webp",
      "Access-Control-Allow-Origin": "*"
    },
    status: status,
  });
});

if (import.meta.main) {
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setRequestInterception(true);

    const headers: Record<string, string>[] = [];

    page.on("request", (request) => {
      const url = request.url().substring(0, 40);
      if (url.includes("a-ads.com") || url.includes("ad.com")) {
        request.abort();
        return;
      }
      request.continue();
    });

    page.on("response", async (response) => {
      const header = response.headers();
      if (header["content-type"] == "image/webp") {
        image.push(await response.content());
        headers.push(header);
      }
    });

    // await page.goto("https://chapmanganato.to/manga-xr1000500/chapter-10")
    await page.goto("https://chapmanganato.to/manga-vp998972/chapter-5");
    setTimeout(async () => {
      await browser.close();
    }, 5000);
  })();
}
