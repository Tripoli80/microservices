# gRPC Filtering Service

Two NestJS microservices that communicate via gRPC. The Producer reads user data from JSON, filters by age, and exposes it via gRPC. The Consumer calls the Producer and exposes the filtered data via HTTP REST API.

## Architecture
```
┌─────────────┐         gRPC           ┌─────────────┐
│  Consumer   │ ────────────────────>  │  Producer   │
│  Service    │                        │  Service    │
│ (Port 3000) │                        │ (Port 50051)│
└─────────────┘                        └─────────────┘
      │                                       │
      │                                       │
 HTTP REST API
      │
```

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up --build
```

This builds and starts both services. Producer runs on port 50051, Consumer on port 3000.

**Useful commands:**
```bash
docker-compose up -d          # Start in background
docker-compose logs -f        # View logs
docker-compose down           # Stop services
```

### Local Development

**Terminal 1 - Start Producer:**
```bash
cd producer
npm install
npm run start:dev
```

**Terminal 2 - Start Consumer:**
```bash
cd consumer
npm install
npm run start:dev
```

## Testing

After running the services, you'll immediately see the filtered users in the console logs. The Consumer service automatically requests data from Producer on startup and displays it:

```
Producer response Users: [
  { id: 1, age: 25, name: 'Alice' },
  { id: 3, age: 30, name: 'Charlie' },
  { id: 4, age: 22, name: 'David' },
  ...
]
```

You can also test the HTTP endpoint:

```bash
curl http://localhost:3000/get-filtered-users
```

Or open `http://localhost:3000/get-filtered-users` in your browser.

Both will return a JSON array of users filtered by age (default: age > 18).

## Project Structure

```
microservices/
├── producer/
│   ├── src/
│   │   ├── data/user.json    # User data
│   │   ├── main.ts           # gRPC server entry point
│   │   ├── user.service.ts   # Filtering logic
│   │   └── user.controller.ts
│   └── Dockerfile
├── consumer/
│   ├── src/
│   │   ├── main.ts           # HTTP server entry point
│   │   ├── consumer.service.ts # gRPC client
│   │   └── app.controller.ts  # REST endpoint
│   └── Dockerfile
├── proto/
│   └── users.proto            # gRPC service definition
└── docker-compose.yml
```

## API

**Producer (gRPC):**
- Port: `50051`
- Service: `GetFilteredUsers`
- Method: `GetFilteredUsers(age: number) -> { users: User[] }`

**Consumer (HTTP REST):**
- Port: `3000`
- Endpoint: `GET /get-filtered-users`
- Returns: `User[]` (JSON array)

## gRPC Protocol

Defined in `proto/users.proto`:

```protobuf
service GetFilteredUsers {
  rpc GetFilteredUsers (GetFilteredUsersRequest) returns (GetFilteredUsersResponse);
}

message GetFilteredUsersRequest {
  int32 age = 1;
}

message GetFilteredUsersResponse {
  repeated User users = 1;
}

message User {
  int32 id = 1;
  int32 age = 2;
  string name = 3;
}
```

## Configuration

- **Producer gRPC port**: `50051`
- **Consumer HTTP port**: `3000` (configurable via `PORT` env var)
- **Default age filter**: `18` (users with age > 18)

To change user data, edit `producer/src/data/user.json` and rebuild:
```bash
docker-compose up --build producer
```

## Troubleshooting

**Services won't start:**
- Check if ports 50051 and 3000 are free
- View logs: `docker-compose logs`
- Rebuild: `docker-compose down && docker-compose up --build`

**gRPC connection issues:**
- Make sure Producer starts before Consumer
- Check network: `docker-compose ps`
- Verify proto file exists in both containers

**Proto file errors:**
- Ensure `proto/users.proto` is in project root
- Check Dockerfile copies proto correctly

## Notes

- Both services use the same `proto/users.proto` file
- Proto paths use `process.cwd()` to work in both local and Docker environments
- Consumer automatically requests filtered users on startup
- Filtering uses `age > threshold`

