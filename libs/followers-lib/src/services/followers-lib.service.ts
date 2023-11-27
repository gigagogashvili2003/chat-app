import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FollowDto, UnfollowDto } from '../dtos';
import { User } from '@prisma/client';
import { ErrorMessages, GenericResponse, QueueNames, SuccessMessages } from '@app/common-lib';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UsersMessagePatterns } from '@app/users-lib';
import { FollowersRepository } from '../repositories/followers.repository';

@Injectable()
export class FollowersLibService {
  public constructor(
    @Inject(QueueNames.USERS_QUEUE) private usersClient: ClientProxy,
    private readonly followersRepository: FollowersRepository,
  ) {}

  public async follow(followDto: FollowDto, user: User): Promise<GenericResponse<null>> {
    const followerId = parseInt(followDto.followerId);
    const followeeId = parseInt(followDto.followeeId);
    const userId = user.id;

    try {
      if (followerId !== userId) {
        throw new BadRequestException(ErrorMessages.INVALID_FOLLOWER);
      }

      const followee = await lastValueFrom<User>(this.usersClient.send(UsersMessagePatterns.FIND_ONE_ID, followeeId));

      if (!followee) {
        throw new NotFoundException(ErrorMessages.FOLLOWEE_NOT_FOUND);
      }

      if (followee.id === followerId) {
        throw new BadRequestException(ErrorMessages.FOLLOW_YOURSELF);
      }

      const alreadyFollow = await this.followersRepository.findOne({ followerId, followeeId });

      if (alreadyFollow) {
        throw new ConflictException(ErrorMessages.ALREADY_FOLLOWING + followee.username);
      }

      await this.followersRepository.create({
        followeeId,
        followerId,
      });

      return {
        message: SuccessMessages.FOLLOWED_USER + followee.username,
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw err;
    }
  }

  public async unfollow(unfollowDto: UnfollowDto, user: User): Promise<GenericResponse<null>> {
    const unfollowerId = parseInt(unfollowDto.unfollowerId);
    const unfolloweeId = parseInt(unfollowDto.unfolloweeId);
    const userId = user.id;

    try {
      if (unfollowerId !== userId) {
        throw new BadRequestException(ErrorMessages.INVALID_UNFOLLOWER);
      }
      const unfollowee = await lastValueFrom<User>(
        this.usersClient.send(UsersMessagePatterns.FIND_ONE_ID, unfolloweeId),
      );

      if (!unfollowee) {
        throw new NotFoundException(ErrorMessages.UNFOLLOWEE_NOT_FOUND);
      }

      if (unfollowee.id === unfollowerId) {
        throw new BadRequestException(ErrorMessages.UNFOLLOW_YOURSELF);
      }

      const isFollowing = await this.followersRepository.findOne({
        followerId: unfollowerId,
        followeeId: unfolloweeId,
      });

      if (!isFollowing) {
        throw new NotFoundException(ErrorMessages.NOT_FOLLOWING_USER + unfollowee.username);
      }

      await this.followersRepository.deleteById(isFollowing.id);

      return {
        status: HttpStatus.NO_CONTENT,
        message: SuccessMessages.UNFOLLOWED_USER + unfollowee.username,
      };
    } catch (err) {
      throw err;
    }
  }
}
