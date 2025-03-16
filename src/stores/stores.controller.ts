import { Controller, Get, Query, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { StoreFormDTO } from './dto/store-form.dto';
import { responseExampleForReview, responseExampleForStore } from 'src/constants/swagger';
import { PaymentStatusFormDTO } from './dto/payment-status-form.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ReviewFormDTO } from 'src/reviews/dto/review-form.dto';
import { LikeAction } from './stores.type';

@ApiTags('Store')
@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly reviewsService: ReviewsService
  ) {}

  @Post()
  @ApiOperation({
    summary: '매장 등록',
  })
  @ApiResponse(responseExampleForStore.register)
  registerStore(@Body() storeFormDto: StoreFormDTO) {
    return this.storesService.registerStore(storeFormDto);
  }

  @Get()
  @ApiOperation({
    summary: '매장 목록 조회',
  })
  @ApiQuery({ name: 'skip', required: false, type: 'number', default: 0 })
  @ApiQuery({ name: 'take', required: false, type: 'number', default: 10 })
  @ApiResponse(responseExampleForStore.list)
  getStores(@Query('take') take?: number | typeof NaN, @Query('skip') skip?: number | typeof NaN) {
    return this.storesService.getStores(take, skip);
  }

  @Get('/:id')
  @ApiOperation({
    summary: '매장 단건 조회',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.detail)
  getStore(@Param('id') id: string) {
    return this.storesService.getStore(id);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: '매장 결제 가능 여부 변경',
    description: 'paymentStatus의 값은 available, unavailable만 가능합니다.',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.changePaymentStatus)
  changePaymentStatus(@Param('id') id: string, @Body() paymentStatusFormDto: PaymentStatusFormDTO) {
    return this.storesService.changePaymentStatus(id, paymentStatusFormDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: '등록된 매장 삭제',
  })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.delete)
  deleteStore(@Param('id') id: string) {
    return this.storesService.deleteStore(id);
  }

  @Patch('/:id/like')
  @ApiOperation({ summary: '매장 좋아요' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse(responseExampleForStore.like)
  @ApiBody({
    schema: {
      example: { action: 'like | unlike' },
    },
  })
  likeStore(@Param('id') id: string, @Body() { action }: { action: LikeAction }) {
    return this.storesService.like(id, action);
  }

  @Post('/:storeId/reviews')
  @ApiOperation({
    summary: '매장 리뷰 생성',
  })
  @ApiParam({ name: 'storeId', required: true, type: 'string' })
  @ApiResponse(responseExampleForReview.create)
  createReview(@Param('storeId') storeId: string, @Body() reviewForm: ReviewFormDTO) {
    return this.reviewsService.create(storeId, reviewForm);
  }

  @Get('/:storeId/reviews')
  @ApiOperation({
    summary: '매장 별 리뷰 목록 조회',
  })
  @ApiParam({ name: 'storeId', required: true, type: 'string' })
  @ApiQuery({ name: 'skip', required: false, type: 'number', default: 0 })
  @ApiQuery({ name: 'take', required: false, type: 'number', default: 10 })
  @ApiResponse(responseExampleForReview.list)
  getReviewsByStore(
    @Param('storeId') storeId: string,
    @Query('take') take?: number | typeof NaN,
    @Query('skip') skip?: number | typeof NaN
  ) {
    return this.reviewsService.getReviewsByStore(storeId, take, skip);
  }
}
