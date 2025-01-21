import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateVenueDto } from './dto/venue.dto';
import { CreateTicketDto, CreateTicketTypeDto } from './dto/ticket.dto';
import { TicketStatus } from '@prisma/client';

type ExcludeField<T, K extends keyof T> = Omit<T, K>;

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async profile(admin_id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: {
        id: admin_id,
      },
    });

    return this.excludeField(admin, 'password');
  }

  async getVenueByCityId(city_id: string) {
    return await this.prisma.venue.findMany({
      where: {
        locationId: city_id,
      },
    });
  }

  async createVenue(dto: CreateVenueDto) {
    const city = await this.prisma.city.findUnique({
      where: {
        id: dto.locationId,
      },
    });

    if (!city) throw new BadRequestException('City not found');

    const venue = await this.prisma.venue.create({
      data: {
        name: dto.name,
        locationId: city.id,
        seatMapUrl: dto.seatMapUrl,
      },
    });

    return venue;
  }

  async getTicketType() {
    return await this.prisma.ticketType.findMany();
  }

  async createTicketType(dto: CreateTicketTypeDto) {
    const existingTicketType = await this.prisma.ticketType.findFirst({
      where: { name: dto.name },
    });

    if (existingTicketType) {
      throw new BadRequestException(
        'Ticket type with this name already exists',
      );
    }

    const ticketType = await this.prisma.ticketType.create({
      data: {
        name: dto.name,
        price: dto.price,
        description: dto.description,
      },
    });

    return ticketType;
  }

  async createTicket(dto: CreateTicketDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: dto.ticketTypeId },
    });

    if (!ticketType) {
      throw new BadRequestException('Ticket type not found');
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        eventId: dto.eventId,
        seatNumber: dto.seatNumber,
        price: dto.price,
        ticketTypeId: dto.ticketTypeId,
        status: TicketStatus.AVAILABLE,
      },
    });

    return ticket;
  }

  private excludeField<T, K extends keyof T>(
    obj: T,
    key: K,
  ): ExcludeField<T, K> {
    const { [key]: ignored, ...rest } = obj;
    void ignored;
    return rest as ExcludeField<T, K>;
  }
}
