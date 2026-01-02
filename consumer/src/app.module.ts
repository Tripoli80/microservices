import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { resolve, join } from 'path';
import { existsSync } from 'fs';
import { ConsumerService } from './consumer.service';
import { AppController } from './app.controller';

function getProtoPath(): string {
  // Try different possible locations
  const paths = [
    resolve(__dirname, '../../proto/users.proto'), // Docker: /app/dist/src -> /app/proto
    resolve(__dirname, '../../../proto/users.proto'), // Local: consumer/dist/src -> proto
    join(process.cwd(), 'proto/users.proto'), // Fallback: from current working directory
  ];
  
  for (const path of paths) {
    if (existsSync(path)) {
      return path;
    }
  }
  
  // Return the first path as default (will show error if file doesn't exist)
  return paths[0];
}

function getProducerUrl(): string {
  // Use environment variable if set, otherwise default to localhost for local development
  return process.env.PRODUCER_URL || 'localhost:50051';
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'users',
          protoPath: getProtoPath(),
          url: getProducerUrl(),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ConsumerService],
})
export class AppModule {}
