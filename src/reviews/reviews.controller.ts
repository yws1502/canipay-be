import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { responseExampleForReview } from 'src/constants/swagger';

@ApiTags('Review')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Patch(':id')
  @ApiOperation({
    summary: '리뷰 신고',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForReview.report)
  report(@Param('id') id: string) {
    return this.reviewsService.report(id);
  }

  @Get()
  @ApiOperation({
    summary: '리뷰 목록 조회',
  })
  @ApiQuery({ name: 'skip', required: false, type: 'number', default: 1 })
  @ApiQuery({ name: 'take', required: false, type: 'number', default: 10 })
  @ApiQuery({ name: 'isReported', required: false, type: 'boolean', default: false })
  @ApiResponse(responseExampleForReview.list)
  list(
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN,
    @Query('isReported') isReported?: boolean
  ) {
    return this.reviewsService.list(take, skip, isReported);
  }
}
