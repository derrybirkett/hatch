import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private authService: AuthService) {}

  async onModuleInit() {
    if (process.env['NODE_ENV'] !== 'production') {
      try {
        await this.authService.register({
          email: 'demo@example.com',
          name: 'Demo User',
          password: 'demo123',
        });
        console.log('✓ Demo user created (demo@example.com / demo123)');
      } catch {
        console.log('✓ Demo user already exists');
      }
    }
  }
}
