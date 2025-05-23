import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL puuttuu' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text();
    const bodyText = $('body').text();

    const hasPhone = /\+?\d{5,}/.test(bodyText);
    const hasFeedback = /asiakaspalautteet?|referenssit?|suositukset?/i.test(bodyText);

    res.status(200).json({ title, metaDescription, h1, hasPhone, hasFeedback });
  } catch (error) {
    console.error('Virhe:', error);
    res.status(500).json({ error: 'Analyysi epäonnistui' });
  }
}
