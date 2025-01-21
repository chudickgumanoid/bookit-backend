import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCityDto, UpdateCityDto } from './dto/city.dto';

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCityDto) {
    return await this.prisma.city.create({
      data: {
        title: dto.title,
        name: dto.name,
      },
    });
  }

  async all() {
    return await this.prisma.city.findMany();
  }

  async findOne(city_id: string) {
    return await this.prisma.city.findUnique({
      where: {
        id: city_id,
      },
    });
  }

  async update(city_id: string, dto: UpdateCityDto) {
    return await this.prisma.city.update({
      where: {
        id: city_id,
      },
      data: dto,
    });
  }

  async remove(city_id: string) {
    return await this.prisma.city.delete({
      where: {
        id: city_id,
      },
    });
  }
}
