import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue stats' })
  async getRevenue(@Query('start') start: string, @Query('end') end: string) {
    return this.analyticsService.getRevenueStats(new Date(start), new Date(end));
  }

  @Get('barber-performance')
  @ApiOperation({ summary: 'Get barber performance metrics' })
  async getBarberStats() {
    return this.analyticsService.getBarberPerformance();
  }
}