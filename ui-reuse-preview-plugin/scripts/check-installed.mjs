import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const pluginRoot = await realpath(process.argv[2]);
const workspaceRoot = await realpath(process.argv[3]);
const configuration = JSON.parse(await readFile(path.join(pluginRoot, '.mcp.json'), 'utf8')).mcpServers['ui-use-preview'];
const resolveRoot = value => value.replaceAll('${CLAUDE_PLUGIN_ROOT}', pluginRoot).replaceAll('${PLUGIN_ROOT}', pluginRoot);
const client = new Client({ name: 'installed-plugin-check', version: '1.0.0' });
const transport = new StdioClientTransport({ command: configuration.command, args: configuration.args.map(resolveRoot), cwd: resolveRoot(configuration.cwd), stderr: 'pipe' });
let stderr = '';
transport.stderr?.on('data', chunk => { stderr = (stderr + chunk.toString('utf8')).slice(-16000); });
try {
  await client.connect(transport, { timeout: 10000 });
  const tools = await client.listTools();
  const panel = await client.callTool({ name: 'open_ui_reuse', arguments: { workspaceRoot } });
  if (panel.isError) throw new Error(panel.content[0].text);
  const resource = await client.readResource({ uri: 'ui://ui-use-preview/app.html' });
  if (!resource.contents[0].text.includes('生成标注')) throw new Error('Missing built app resource.');
  const scan = await client.callTool({ name: 'scan_workspace_ui', arguments: { sessionId: panel.structuredContent.sessionId } });
  if (scan.isError) throw new Error(scan.content[0].text);
  console.log(JSON.stringify({ success: true, tools: tools.tools.length, workspace: panel.structuredContent.workspaceName, scannedFiles: scan.structuredContent.filesScanned, appResource: 'ready' }));
} catch (error) {
  console.error(error.message);
  if (stderr) console.error(stderr);
  process.exitCode = 1;
} finally { await client.close(); }
