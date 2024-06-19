import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile:  join(process.cwd(), 'src/schema.graphql'),
      definitions:  {path: join(process.cwd(), 'src/model.ts')}
      //typePaths: ['./src/**/*.graphql'] // schema first approach
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0', // Replace with the appropriate PostgreSQL container or host address
      port: 5432,
      username: 'postgres',
      password: 'nestJS', // The password you set in the Docker run command
      database: 'nestjsgraphql', // Replace with your desired database name
      autoLoadEntities: true,
      entities: [__dirname + './src/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService,AppResolver],
})
export class AppModule {}
