const fs = require('fs');
const file = 'src/app/(home)/home/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<nav className="fixed top-0 w-full z-50 p-4 pointer-events-none">[\s\S]*?<\/nav>/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
