# Getting Started

This assumes that you have the docker templates loaded into GNS3 \
GNS3 VM must be on 

Interface for https://github.com/TollanBerhanu/ae3gis-gns3-api

## Dependencies:

lucide-react (icons) \
dexie \
dexie-react-hooks

## Installing Dependencies:

npm install -g pnpm (optional)

npm add lucide-react \
npm install dexie dexie-react-hooks

## Create .env.local file

GNS3_URL=http://{IP_ADDRESS}:{PORT_NUMBER}/v2 \
AE3GIS_URL=http://{IP of AE3GIS API}:{PORT} \
NEXT_PUBLIC_GNS3_IP={IP Address of GNS3 Server}

## First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
