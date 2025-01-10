import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import * as process from 'node:process';
import { ServeStaticModule } from '@nestjs/serve-static';

import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/users.model';
import { RolesModule } from './modules/roles/roles.module';
import { Role } from './modules/roles/roles.model';
import { UserRoles } from './modules/roles/user-roles.model';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { Post } from './modules/posts/posts.model';
import { FilesModule } from './modules/files/files.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { PostsController } from './modules/posts/posts.controller';
import { RolesController } from './modules/roles/roles.controller';
import { UsersController } from './modules/users/users.controller';

const isProdEnv = process.env.NODE_ENV === 'prod'
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
      serveStaticOptions: {
        index: false
      }
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      uri:  isProdEnv ? process.env.DATABASE_URL : '',
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT),
      username: isProdEnv ? process.env.PGUSER : process.env.POSTGRES_USER,
      password: isProdEnv ? process.env.PGPASSWORD: process.env.POSTGRES_PASSWORD,
      database: isProdEnv ? process.env.PGDATABASE : process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Post],
      autoLoadModels: true,
      logging: console.log,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PostsController, RolesController, UsersController);
  }
}