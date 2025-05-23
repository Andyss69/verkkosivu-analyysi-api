import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/analysoi', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL puuttuu' });

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const title = $('title').text().trim();
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').first().text().trim();
    const hasPhone = html.match(/\+?\d{2,3}[\s-]?\d{3,}/) ? true : false;
    const hasFeedback = html.toLowerCase().includes('asiakaspalaute') || html.toLowerCase().includes('referenssi');

    res.json({
      title,
      metaDescription: metaDesc,
      h1,
      hasPhone,
      hasFeedback
    });
  } catch (e) {
    res.status(500).json({ error: 'Sivun lataus epäonnistui' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Analyysipalvelin käynnissä portissa ${PORT}`));
