import { Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
