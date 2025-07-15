const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, 'public', 'icons', 'icon.svg');
const outputDir = path.join(__dirname, 'public', 'icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a simple colored square icon as SVG
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="64" fill="url(#grad1)"/>
  
  <!-- Chat icon -->
  <path d="M128 180c0-33.137 26.863-60 60-60h136c33.137 0 60 26.863 60 60v88c0 33.137-26.863 60-60 60h-76l-60 60v-60h-60c-33.137 0-60-26.863-60-60v-88z" fill="white" opacity="0.9"/>
  
  <!-- Message dots -->
  <circle cx="200" cy="224" r="12" fill="#3b82f6"/>
  <circle cx="256" cy="224" r="12" fill="#3b82f6"/>
  <circle cx="312" cy="224" r="12" fill="#3b82f6"/>
  
  <!-- Second chat bubble -->
  <path d="M328 300c0-22.091 17.909-40 40-40h100c22.091 0 40 17.909 40 40v60c0 22.091-17.909 40-40 40h-20v20l-20-20h-60c-22.091 0-40-17.909-40-40v-60z" fill="white" opacity="0.7"/>
</svg>
`;

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${outputFile}`);
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
