const fs = require('fs');
const path = require('path');

const IMAGE_FOLDER = 'images';
const HTML_FILE = 'index.html';

// 1. Get list of image files
try {
    const files = fs.readdirSync(IMAGE_FOLDER);

    const images = files
        .filter(f => {
            const ext = path.extname(f).toLowerCase();
            return ['.jpg'].includes(ext);
        })
        .sort() // Sort alphabetically
        .map(img => `images/${img}`); // Prepend folder path

    // 2. Build the new JavaScript array string
    // Use JSON.stringify for clean formatting (4-space indentation)
    const newJsContent = `const images = ${JSON.stringify(images, null, 4)};`;

    // 3. Read the HTML file content
    let html = fs.readFileSync(HTML_FILE, 'utf-8');

    // 4. Use Regex to locate and replace the existing "const images = [...]"
    const regex = /const images\s*=\s*\[[\s\S]*?\];/;
    
    if (regex.test(html)) {
        const updatedHtml = html.replace(regex, newJsContent);

        // 5. Overwrite the file with the updated content
        fs.writeFileSync(HTML_FILE, updatedHtml, 'utf-8');
        console.log('✅ index.html updated successfully with all images!');
    } else {
        console.error('❌ Could not find the "const images" variable in the HTML file.');
    }

} catch (err) {
    console.error('❌ An error occurred:', err.message);
}