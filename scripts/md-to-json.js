import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DIRECTORY_PATH = path.join(__dirname, '../src/data/directory');
const JSON_FILE = path.join(DIRECTORY_PATH, 'directory.json');

// Read existing JSON file
let listings = [];
if (fs.existsSync(JSON_FILE)) {
    listings = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
}

// Process all markdown files
const processMarkdownFiles = () => {
    const mdFiles = fs.readdirSync(DIRECTORY_PATH)
        .filter(file => file.endsWith('.md'));

    mdFiles.forEach(file => {
        const filePath = path.join(DIRECTORY_PATH, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: description } = matter(content);
        
        // Create listing ID from filename
        const id = path.basename(file, '.md')
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        // Check if listing already exists
        const existingIndex = listings.findIndex(item => item.id === id);
        
        const newListing = {
            id,
            title: data.title || data.text || path.basename(file, '.md'),
            image: data.image || "",
            description: description.trim() || data.description || "",
            link: data.link || "https://minteddirectory.com",
            tags: data.tags || []
        };

        if (data.featured) {
            newListing.featured = true;
        }

        if (existingIndex !== -1) {
            // Update existing listing
            listings[existingIndex] = {
                ...listings[existingIndex],
                ...newListing
            };
        } else {
            // Add new listing
            listings.push(newListing);
        }

        // Remove the markdown file after processing
        fs.unlinkSync(filePath);
    });

    // Write updated listings back to JSON file
    fs.writeFileSync(JSON_FILE, JSON.stringify(listings, null, 2));
}

// Run the processor
processMarkdownFiles();
console.log('Successfully processed markdown files to JSON!');
