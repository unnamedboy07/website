export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let { pathname } = url;

    // 1. If path is "/" or empty, serve index.html
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    // 2. Try to fetch the file exactly as requested
    let newUrl = new URL(request.url);
    newUrl.pathname = pathname;
    
    // Attempt to find the file in your uploaded assets
    let response = await env.ASSETS.fetch(newUrl);

    // 3. Clean URL Handling: If file not found (404), try adding ".html"
    // This allows links like "/contact" to load "contact.html"
    if (response.status === 404 && !pathname.endsWith('.html')) {
      newUrl.pathname = pathname + '.html';
      const retryResponse = await env.ASSETS.fetch(newUrl);
      
      // If adding .html worked, use that response instead
      if (retryResponse.status === 200) {
        response = retryResponse;
      }
    }

    return response;
  }
};