const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);
const curlExecutable = process.platform === 'win32' ? 'curl.exe' : 'curl';

function parseResponseHeaders(rawHeaders) {
  const blocks = rawHeaders
    .split(/\r?\n\r?\n/)
    .filter((block) => /^HTTP\//.test(block));
  const responseBlock = blocks.at(-1);

  if (!responseBlock) {
    throw new Error('HTTP/1.1 bridge returned no response headers.');
  }

  const statusMatch = responseBlock.match(/^HTTP\/\S+\s+(\d+)/);
  if (!statusMatch) {
    throw new Error('HTTP/1.1 bridge returned an invalid status line.');
  }

  const headersArray = [];
  for (const line of responseBlock.split(/\r?\n/).slice(1)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;

    const name = line.slice(0, separator).trim();
    if (
      /^(content-length|transfer-encoding|content-encoding|connection)$/i.test(
        name,
      )
    ) {
      continue;
    }
    headersArray.push({
      name,
      value: line.slice(separator + 1).trim(),
    });
  }

  return {
    status: Number(statusMatch[1]),
    headersArray,
  };
}

async function requestOverHttp1(request) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'redbus-http1-'));
  const headersPath = path.join(directory, 'response-headers.txt');
  const bodyPath = path.join(directory, 'response-body.bin');
  const requestBodyPath = path.join(directory, 'request-body.bin');
  const args = [
    '-4',
    '--http1.1',
    '--silent',
    '--show-error',
    '--max-time',
    '40',
    '--dump-header',
    headersPath,
    '--output',
    bodyPath,
    '--request',
    request.method(),
    '--header',
    'Accept-Encoding: identity',
  ];

  const requestHeaders = await request.allHeaders();
  for (const name of [
    'accept',
    'accept-language',
    'content-type',
    'cookie',
    'origin',
    'referer',
  ]) {
    if (requestHeaders[name]) {
      args.push('--header', `${name}: ${requestHeaders[name]}`);
    }
  }

  const body = request.postDataBuffer();
  if (body) {
    await fs.writeFile(requestBodyPath, body);
    args.push('--data-binary', `@${requestBodyPath}`);
  }
  args.push(request.url());

  try {
    await execFileAsync(curlExecutable, args, {
      encoding: 'buffer',
      maxBuffer: 50 * 1024 * 1024,
    }).catch((error) => {
      const code = error.code || 'CURL_FAILED';
      throw new Error(`HTTP/1.1 bridge request failed (${code}).`);
    });
    const rawHeaders = await fs.readFile(headersPath, 'utf8');
    const response = parseResponseHeaders(rawHeaders);
    response.body = await fs.readFile(bodyPath);
    return response;
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

async function installHttp1BrowserBridge(context, baseUrl) {
  const targetHost = new URL(baseUrl).hostname;
  await context.route('**/*', async (route) => {
    const request = route.request();
    const requestUrl = new URL(request.url());
    if (requestUrl.hostname !== targetHost) {
      await route.continue();
      return;
    }
    if (request.resourceType() === 'font') {
      await route.continue();
      return;
    }

    try {
      await route.fulfill(await requestOverHttp1(request));
    } catch (error) {
      throw new Error(
        `HTTP/1.1 bridge failed for ${requestUrl.pathname}: ${error.message}`,
        { cause: error },
      );
    }
  });
}

module.exports = installHttp1BrowserBridge;
