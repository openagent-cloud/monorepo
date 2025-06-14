import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiKey } from '../../utils/decorators/api-key.decorator'
import {
  ApiOperation,
  ApiTags,
  ApiHeader,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger'
import { AnalyticsService } from './analytics.service'
import { TokenAnalytics } from './analytics.types'
import {
  TokenAnalyticsDto,
  TokenUsageByDayDto,
  TokenUsageByModelDto,
  ServiceTokenUsageDto,
  TokenAnalyticsSummaryDto
} from './dto/token-analytics.dto'
import { ErrorResponseDto } from '../../utils/dto/error-response.dto'

@ApiTags('Analytics')
@ApiExtraModels(
  TokenAnalyticsDto,
  TokenUsageByDayDto,
  TokenUsageByModelDto,
  ServiceTokenUsageDto,
  TokenAnalyticsSummaryDto,
  ErrorResponseDto
)
@ApiHeader({
  name: 'x-api-key',
  description: 'Tenant API key for authentication',
  required: true,
  schema: { type: 'string' },
  example: 'tnnt_01h9xgsvs3kqb6qj6zd9kh7qpz'
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized - Invalid or missing API key',
  type: ErrorResponseDto
})
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get detailed token usage analytics for the tenant',
    description:
      'Retrieves comprehensive token usage analytics including breakdowns by model, service, and day. Useful for monitoring costs and usage patterns.',
    operationId: 'getTokenAnalytics'
  })
  @ApiQuery({
    name: 'days',
    description: 'Number of days to analyze',
    required: false,
    type: Number,
    example: 30,
    schema: {
      minimum: 1,
      maximum: 365,
      default: 30
    }
  })
  @ApiOkResponse({
    description: 'Detailed token usage analytics',
    type: TokenAnalyticsDto,
    schema: {
      allOf: [{ $ref: getSchemaPath(TokenAnalyticsDto) }]
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing API key',
    type: ErrorResponseDto
  })
  async getTokenAnalytics(
    @ApiKey() apiKey: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number
  ): Promise<TokenAnalytics> {
    return this.analyticsService.getTokenAnalytics(apiKey, days)
  }
}
