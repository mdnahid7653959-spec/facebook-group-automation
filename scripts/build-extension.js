import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Extract current git commit metadata
let currentGitSha = '33b84ad5f000c0e7f880c3543f8e8b64650f67dc';
let currentShortSha = '33b84ad';
let currentCommitMsg = 'resilient bulk group import';
let commitDate = new Date().toISOString();

try {
  currentGitSha = execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
  currentShortSha = execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim();
  currentCommitMsg = execSync('git log -1 --format=%s', { cwd: rootDir }).toString().trim();
  commitDate = execSync('git log -1 --format=%cI', { cwd: rootDir }).toString().trim();
} catch (e) {
  console.warn('⚠️ Could not extract git commit info:', e.message);
}

const buildDefines = {
  __APP_COMMIT_SHA__: JSON.stringify(currentGitSha),
  __APP_SHORT_SHA__: JSON.stringify(currentShortSha),
  __APP_COMMIT_MSG__: JSON.stringify(currentCommitMsg),
  __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
};

async function buildExtension() {
  console.log('🚀 Building AI Group Poster Chrome Extension...');
  console.log(`📌 Git Commit: ${currentShortSha} (${currentGitSha})`);

  // Clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Build HTML UI Pages
  console.log('📦 Step 1: Building Popup, Dashboard & Options pages...');
  await build({
    root: rootDir,
    plugins: [react()],
    define: buildDefines,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        input: {
          dashboard: path.resolve(rootDir, 'src/pages/dashboard/index.html'),
          popup: path.resolve(rootDir, 'src/pages/popup/index.html'),
          options: path.resolve(rootDir, 'src/pages/options/index.html'),
        },
      },
    },
  });

  // 2. Build Service Worker (ES module)
  console.log('📦 Step 2: Building Service Worker...');
  await build({
    configFile: false,
    root: rootDir,
    define: buildDefines,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/background/service-worker.ts'),
        name: 'ServiceWorker',
        formats: ['es'],
        fileName: () => 'service-worker.js',
      },
    },
  });

  // 3. Build Facebook Content Script (IIFE for isolated page injection)
  console.log('📦 Step 3: Building Facebook Content Script...');
  await build({
    configFile: false,
    root: rootDir,
    define: buildDefines,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/content/facebook-content.ts'),
        name: 'FacebookContent',
        formats: ['iife'],
        fileName: () => 'facebook-content.js',
      },
    },
  });

  // 3b. Build Prevent BeforeUnload Script (IIFE for MAIN world page injection)
  console.log('📦 Step 3b: Building Prevent BeforeUnload Script...');
  await build({
    configFile: false,
    root: rootDir,
    define: buildDefines,
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/content/prevent-beforeunload.ts'),
        name: 'PreventBeforeUnload',
        formats: ['iife'],
        fileName: () => 'prevent-beforeunload.js',
      },
    },
  });

  // 4. Copy manifest.json, icons, & write build-info.json
  console.log('📦 Step 4: Finalizing manifest, build-info and static assets...');
  const manifestSrc = path.resolve(rootDir, 'public/manifest.json');
  const manifestDest = path.resolve(distDir, 'manifest.json');
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
    console.log('✅ manifest.json copied to dist/');
  }

  const webManifestSrc = path.resolve(rootDir, 'public/app.webmanifest');
  const webManifestDest = path.resolve(distDir, 'app.webmanifest');
  if (fs.existsSync(webManifestSrc)) {
    fs.copyFileSync(webManifestSrc, webManifestDest);
    console.log('✅ app.webmanifest copied to dist/');
  }

  const iconsSrc = path.resolve(rootDir, 'public/icons');
  const iconsDest = path.resolve(distDir, 'icons');
  if (fs.existsSync(iconsSrc)) {
    fs.cpSync(iconsSrc, iconsDest, { recursive: true });
    console.log('✅ icons copied to dist/icons');
  }

  // Write build metadata
  const buildInfo = {
    version: '1.0.1',
    commitSha: currentGitSha,
    shortSha: currentShortSha,
    message: currentCommitMsg,
    commitDate,
    builtAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.resolve(distDir, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
  // 5. Create 100% Standards-Compliant POSIX ZIP archive for Kiwi / Lemur / Android
  console.log('📦 Step 5: Packaging mobile zip archive (AI-Group-Poster-Mobile.zip)...');
  const zipPath = path.resolve(rootDir, 'AI-Group-Poster-Mobile.zip');
  try {
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    createPosixZip(distDir, zipPath);
    console.log(`✅ Clean POSIX Mobile ZIP created at: ${zipPath}`);
  } catch (zipErr) {
    console.warn('⚠️ Could not generate zip archive automatically:', zipErr.message);
  }

  console.log('✨ Build successfully completed! Load unpacked folder: dist/ or use AI-Group-Poster-Mobile.zip on mobile');
}

/**
 * Creates 100% standards-compliant POSIX zip archive for Android (Kiwi/Lemur browser)
 * Eliminates Windows backslash path separator bugs.
 */
function createPosixZip(sourceDir, outZipPath) {
  function crc32(buf) {
    let crc = ~0;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (~crc) >>> 0;
  }
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[i] = c;
  }

  const files = [];
  function walk(dir, rel) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      const relPath = rel ? rel + '/' + item : item;
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full, relPath);
      } else {
        files.push({ full, relPath: relPath.replace(/\\/g, '/') });
      }
    }
  }
  walk(sourceDir, '');

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const f of files) {
    const data = fs.readFileSync(f.full);
    const uncompressedSize = data.length;
    const crc = crc32(data);
    const compressed = zlib.deflateRawSync(data);
    const compressedSize = compressed.length;
    const nameBuf = Buffer.from(f.relPath, 'utf8');

    // Local file header (30 bytes)
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0x0800, 6); // UTF-8 filename flag
    lh.writeUInt16LE(8, 8); // Deflate
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(compressedSize, 18);
    lh.writeUInt32LE(uncompressedSize, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);

    localHeaders.push(lh, nameBuf, compressed);

    // Central directory header (46 bytes)
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8); // UTF-8 filename flag
    ch.writeUInt16LE(8, 10);
    ch.writeUInt16LE(0, 12);
    ch.writeUInt16LE(0, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(compressedSize, 20);
    ch.writeUInt32LE(uncompressedSize, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32);
    ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36);
    ch.writeUInt32LE(0, 38);
    ch.writeUInt32LE(offset, 42);

    centralHeaders.push(ch, nameBuf);

    offset += lh.length + nameBuf.length + compressed.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const b of centralHeaders) centralDirSize += b.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);

  const allBuffers = [...localHeaders, ...centralHeaders, eocd];
  fs.writeFileSync(outZipPath, Buffer.concat(allBuffers));
}

buildExtension().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
