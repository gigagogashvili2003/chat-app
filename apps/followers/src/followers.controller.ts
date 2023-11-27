import { AccessTokenGuard, CurrentUser, JoiValidationPipe } from '@app/common-lib';
import {
  FollowDto,
  FollowSchema,
  FollowersEndpoints,
  FollowersLibService,
  UnfollowDto,
  UnfollowSchema,
} from '@app/followers-lib';
import { Controller, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller()
export class FollowersController {
  public constructor(private readonly followersLibService: FollowersLibService) {}

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post(FollowersEndpoints.FOLLOW)
  public follow(@CurrentUser() user: User, @Param(new JoiValidationPipe(FollowSchema)) followDto: FollowDto) {
    return this.followersLibService.follow(followDto, user);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(FollowersEndpoints.UNFOLLOW)
  public unfollow(@CurrentUser() user: User, @Param(new JoiValidationPipe(UnfollowSchema)) unfollowDto: UnfollowDto) {
    return this.followersLibService.unfollow(unfollowDto, user);
  }
}
