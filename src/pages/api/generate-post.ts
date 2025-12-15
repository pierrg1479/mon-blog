import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { prompt, saveToFile } = await request.json();
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Tu es expert SEO et domotique. Génère un article de blog optimisé.

Sujet : ${prompt}

Format markdown avec frontmatter :
---
title: 'Titre SEO'
description: 'Meta description'
pubDate: '${new Date().toISOString().split('T')[0]}'
heroImage: '/placeholder.jpg'
---

Article complet ici.`
      }]
    });

    const content = message.content[0].text;
    
    if (saveToFile) {
      const slug = prompt.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
      const filePath = path.join(process.cwd(), 'src', 'content', 'blog', `${slug}.md`);
      fs.writeFileSync(filePath, content);
      
      return new Response(JSON.stringify({ content, filename: `${slug}.md`, saved: true }));
    }

    return new Response(JSON.stringify({ content }));
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
