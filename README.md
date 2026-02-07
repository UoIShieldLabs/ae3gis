# AE3GIS — Agile Emulated Educational Environment for Guided Industrial Security Training

A web-based platform for hands-on cybersecurity education in Industrial Control Systems (ICS) and IT/OT network environments. AE3GIS integrates with GNS3 to let instructors build network topologies, design lab scenarios, and deploy them to students — who then execute attacks, observe defenses, and submit their work for review.

Built for university courses, workshops, and self-study.

---

## Architecture

```
                        +--------------------+
                        |   AE3GIS Frontend  |   (Next.js / React)
                        |   localhost:3000   |
                        +---------+----------+
                                  |
                                  v
                        +--------------------+
                        |   AE3GIS Backend   |   (FastAPI / Python)
                        |   localhost:8000   |
                        +---------+----------+
                                  |
                                  v
                        +--------------------+
                        |    GNS3 Server     |   (local or VM-hosted)
                        |      :3080         |
                        +---------+----------+
                                  |
                    +-------------+-------------+
                    |                           |
              +-----+------+           +-------+--------+
              |  Containers |           |   Scenarios    |
              | (Docker     |           | (Lab exercises |
              |  templates) |           |  and scripts)  |
              +-------------+           +----------------+
```

The **Frontend** proxies requests to the **Backend**, which communicates with the **GNS3 Server** to create projects, deploy nodes, push scripts, and manage student sessions. **Containers** provide the Docker images used as network nodes (workstations, PLCs, firewalls, IDS, etc.). **Scenarios** define the lab exercises students work through.

For institutional deployments, the **Virtual Machines** toolkit spawns isolated GNS3 server instances for each student from a single base image.

---

## Repositories

| Repository | Description |
|------------|-------------|
| [ae3gis-frontend](https://github.com/UoIShieldLabs/ae3gis-frontend) | Next.js web application for instructors and students |
| [ae3gis-backend](https://github.com/UoIShieldLabs/ae3gis-backend) | FastAPI service that interfaces with the GNS3 API |
| [ae3gis-containers](https://github.com/UoIShieldLabs/ae3gis-containers) | Dockerfiles for ICS and networking components (OpenPLC, ScadaBR, Snort, Suricata, Wazuh, Zeek, and more) |
| [ae3gis-virtual-machines](https://github.com/UoIShieldLabs/ae3gis-virtual-machines) | QEMU-based VM spawner for creating per-student GNS3 server instances |
| [ae3gis-scenarios](https://github.com/UoIShieldLabs/ae3gis-scenarios) | Lab scenarios: ARP Spoofing, Denial of Service, Stuxnet ICS simulation |

---

## Prerequisites

- **Node.js 18+** (frontend)
- **Python 3.10+** and **uv** or **pip** (backend)
- **GNS3 Server** with API access enabled (local install or VM)
- **Docker** (for building and loading container templates into GNS3)
- **QEMU** (only if using the VM spawner for institutional deployments)

---

## Getting Started

There are two deployment paths depending on your environment.

### Path A: Personal Device

Use this if you are running GNS3 on your own machine or a single remote server.

**1. Set up the GNS3 Server**

Install GNS3 following the [official guide](https://docs.gns3.com/docs/getting-started/installation/). Ensure the server is running and API access is enabled (default port: 3080).

**2. Build and load container templates**

Clone the containers repository and build the Docker images you need:

```bash
git clone https://github.com/UoIShieldLabs/ae3gis-containers.git
```

Each subfolder contains a Dockerfile and a README with build and GNS3 import instructions. Build the images and add them as Docker templates in GNS3. Refer to the repository README for details.

**3. Start the backend**

```bash
git clone https://github.com/UoIShieldLabs/ae3gis-backend.git
cd ae3gis-backend
```

Configure the `.env` file:

```env
CONFIG_PATH=config/config.generated.json
SCRIPTS_BASE_DIR=scripts
GNS3_REQUEST_DELAY=0.2
```

Install dependencies and run:

```bash
# Using uv (recommended)
uv sync
uv run uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

# Using pip
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

Verify the backend is running at [http://localhost:8000/docs](http://localhost:8000/docs).

**4. Start the frontend**

```bash
git clone https://github.com/UoIShieldLabs/ae3gis-frontend.git
cd ae3gis-frontend
npm install
```

Create a `.env.local` file:

```env
GNS3_URL=http://<GNS3_IP>:<PORT>/v2
NEXT_PUBLIC_GNS3_IP=<GNS3_IP>
AE3GIS_URL=http://localhost:8000
```

For a local GNS3 server, `<GNS3_IP>` is typically `localhost` or `192.168.56.101` if using a GNS3 VM.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The instructor interface is at `/instructor` and the student interface is at `/student`.

**5. Load a scenario**

Clone the scenarios repository for ready-made lab exercises:

```bash
git clone https://github.com/UoIShieldLabs/ae3gis-scenarios.git
```

Each scenario folder contains a README with step-by-step instructions for building the topology and running the lab through the AE3GIS interface.

---

### Path B: Institutional Server (Multi-Student)

Use this if you are an institution providing isolated GNS3 environments to multiple students from a single server.

**1. Prepare the base VM**

Follow the instructions in [ae3gis-virtual-machines](https://github.com/UoIShieldLabs/ae3gis-virtual-machines) to create a base QEMU VM with GNS3, Docker, and all required templates pre-installed.

**2. Spawn student VMs**

Use the spawn script to create overlay VMs with unique IPs:

```bash
git clone https://github.com/UoIShieldLabs/ae3gis-virtual-machines.git
cd ae3gis-virtual-machines
./spawn_in_terminals.sh <COUNT> <START_IP>
```

Each student receives a dedicated GNS3 server instance accessible at their assigned IP on port 3080.

**3. Set up the backend and frontend**

Follow steps 3 and 4 from Path A. Point each frontend instance to the appropriate student GNS3 server IP in the `.env.local` file.

---

## Available Scenarios

| Scenario | Attack Type | Difficulty |
|----------|-------------|------------|
| ARP Spoofing | Man-in-the-Middle (IT layer) | Beginner |
| Denial of Service | SYN/ICMP/UDP floods (IT layer) | Intermediate |
| Stuxnet ICS Simulation | PLC logic manipulation (OT/Field layer) | Advanced |

See [ae3gis-scenarios](https://github.com/UoIShieldLabs/ae3gis-scenarios) for full instructions and scripts.

---

## License

This project is licensed under the MIT License.
