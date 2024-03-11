import type { NextApiRequest, NextApiResponse } from 'next';

import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import sharp from 'sharp';

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine: string = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine); // Push the last line
  return lines;
}

function cutAndAddEllipsis(text: string) {
  const maxWidth = 125;
  if (text.length <= maxWidth) {
    return text;
  }

  return text.substring(0, maxWidth) + '...';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // If there are missing parameters, return an error response
  if (req.query.text == null || req.query.text == undefined) {
    return res.status(400).json({
      status: 'error',
      message: `Missing required query parameters: 'text'`,
    });
  }

  // Ensure text is a string
  const requestText = req.query.text;
  if (typeof requestText !== 'string') {
    return res.status(400).json({
      status: 'error',
      message: `Invalid type for 'text'. Expected a string.`,
    });
  }

  try {
    // Cut the text if needed and add an ellipsis
    const text = cutAndAddEllipsis(requestText);
    const fontSize = 48;

    // Load the original image to get its dimensions
    const originalImage = await sharp(
      'https://raw.githubusercontent.com/agustinustheo/sharp-canvas-ts/main/template.jpg',
    ).metadata();

    // Create a canvas that matches the original image's dimensions
    const canvas = createCanvas(originalImage.width!, originalImage.height!);
    const context = canvas.getContext('2d');

    // Optional: Register a custom font
    context.font = `${fontSize}px sans-serif`;
    context.fillStyle = 'black'; // Text color
    context.textAlign = 'left';
    context.textBaseline = 'top';

    const maxWidth = originalImage.width! * 0.8; // Max width for the text
    const lineHeight = fontSize * 1.2; // Line height
    const lines = wrapText(context, text, maxWidth);
    const textHeight = lines.length * lineHeight; // Calculate the total height of the text block

    // Calculate the starting Y position to center the text block
    const startY = (originalImage.height! - textHeight) / 2;

    // Draw each line of text
    lines.forEach((line, i) => {
      const x = (originalImage.width! - context.measureText(line).width) / 2; // Center each line
      const y = startY + i * lineHeight;
      context.fillText(line, x, y);
    });

    // Convert the canvas to a Buffer
    const textBuffer = canvas.toBuffer();

    // Overlay the text image on the original image
    const imageBuffer = await sharp(
      'https://raw.githubusercontent.com/agustinustheo/sharp-canvas-ts/main/template.jpg',
    )
      .composite([{ input: textBuffer, blend: 'over' }])
      .png()
      .toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}
