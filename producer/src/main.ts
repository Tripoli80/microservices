import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

function getProtoPath(): string {
  // Try different possible locations
  const paths = [
    resolve(__dirname, '../proto/users.proto'), // Docker: /app/dist -> /app/proto
    resolve(__dirname, '../../proto/users.proto'), // Local: producer/dist -> proto
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

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: getProtoPath(),
        url: '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
  console.log('Producer gRPC running on 50051');
}
bootstrap();
