# App2Agent

This repository contains both the backend service and the browser extension for App2Agent. Follow these instructions to get started with development.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)

## Project Structure

- `/backend` - Backend service
- `/extension` - Browser extension

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the backend service:

```bash
cd backend
pnpm dev
```

3. In a new terminal, start the extension development server:

```bash
cd extension
pnpm dev
```

## Development Workflow

1. The backend service will run on `http://localhost:3000` by default
2. The extension development server will provide a development build of the extension
3. Load the extension in your browser:
   - For Chrome/Edge: Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension/dist` directory

## Additional Information

- The project uses pnpm workspaces for managing dependencies
- Make sure to run `pnpm install` from the root directory to install all dependencies
- Check the respective directories for more specific setup instructions

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3)
with an additional hosting restriction. Only Schiesser IT, LLC is permitted
to host, deploy, or run the software on a server or network-accessible environment - see the [LICENSE](LICENSE) file for details.
