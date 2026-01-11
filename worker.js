export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // --- DYNAMIC ROUTE: /article/[slug] ---
    // Example: https://unnamedthings.com/article/dominique-pelicot
    if (pathname.startsWith('/article/')) {
      
      // 1. Extract the slug (e.g., "dominique-pelicot")
      const slug = pathname.split('/').pop();

      // 2. Query the D1 Database
      // We look for a row where the 'slug' column matches our URL
      const caseData = await env.DB.prepare('SELECT * FROM cases WHERE slug = ?')
        .bind(slug)
        .first();

      // 3. Handle "Case Not Found"
      if (!caseData) {
        return new Response("<h1>404: Case File Redacted or Missing</h1>", { 
          status: 404, 
          headers: { 'Content-Type': 'text/html' } 
        });
      }

      // 4. Fetch the "Master Template"
      // We ask the Asset binding to give us the raw HTML file
      const templateRequest = new Request(url.origin + '/articles/template.html', request);
      const templateResponse = await env.ASSETS.fetch(templateRequest);
      
      if (!templateResponse.ok) {
        return new Response("System Error: Template Missing", { status: 500 });
      }
      
      let html = await templateResponse.text();

      // 5. Inject Data (Server-Side Rendering)
      // We replace the {{PLACEHOLDERS}} with real DB data
      html = html.replace(/{{TITLE}}/g, caseData.title);
      html = html.replace(/{{CASE_ID}}/g, caseData.case_id);
      html = html.replace(/{{IMAGE}}/g, caseData.image_url);
      html = html.replace(/{{CONTENT}}/g, caseData.html_content);
      
      // Update page title tag metadata if needed
      html = html.replace('<title>Case Archives', `<title>Case: ${caseData.title}`);

      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // --- STANDARD STATIC ASSETS ---
    // (Your original code for index.html, css, images, etc.)
    if (pathname === '/' || pathname === '') {
      url.pathname = '/index.html';
    }

    let response = await env.ASSETS.fetch(url);

    if (response.status === 404 && !pathname.endsWith('.html')) {
      url.pathname = pathname + '.html';
      const retryResponse = await env.ASSETS.fetch(url);
      if (retryResponse.status === 200) {
        response = retryResponse;
      }
    }

    return response;
  }
};