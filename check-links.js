const { check } = require('linkinator');
const glob = require('glob');

async function run(files) {
  // If no staged files are passed, fall back to all HTML files
  if (!files || files.length === 0) {
    console.log('No HTML files staged. Checking all HTML files in the repository...');
    files = glob.sync('**/*.html', { ignore: 'node_modules/**' });

    if (files.length === 0) {
      console.log('No HTML files found. Skipping link check.');
      process.exit(0);
    }
  }

  let allLinksValid = true;

  for (const file of files) {
    console.log(`Checking links in ${file}...`);
    const results = await check({
      path: file,
      recurse: true,
      concurrency: 5,
    });

    for (const link of results.links) {
      if (link.state === 'BROKEN') {
        console.error(`❌ Broken link found in ${file}: ${link.url}`);
        allLinksValid = false;
      }
    }
  }

  if (allLinksValid) {
    console.log('✅ All links are valid!');
    process.exit(0);
  } else {
    console.error('❌ Broken links detected. ');
    process.exit(1);
  }
}

const stagedFiles = process.argv.slice(2);
run(stagedFiles).catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
