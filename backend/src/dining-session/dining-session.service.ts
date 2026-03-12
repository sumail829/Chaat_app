import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DiningSession, SessionStatus } from './dining-session.entity';
import { RestaurantTable } from 'src/restaurant-table/table.entity';
import { TableStatus } from 'src/restaurant-table/table-status.enum';
import { StartSessionDto } from './dto/start-session.dto';
import { QrService } from './qr.service';


@Injectable()
export class DiningSessionService {
  constructor(
    @InjectRepository(DiningSession)
    private sessionRepo: Repository<DiningSession>,

    @InjectRepository(RestaurantTable)
    private tableRepo: Repository<RestaurantTable>,

    private qrService: QrService,
  ) {}

  // Called by admin to generate QR for a table
  async generateTableQr(tableId: string) {
    const table = await this.tableRepo.findOne({ where: { id: tableId } });
    if (!table) throw new NotFoundException('Table not found');

    const qrUrl = this.qrService.generateQrUrl(tableId);

    // Save QR URL to table
    table.qrCode = qrUrl;
    await this.tableRepo.save(table);

    return {
      tableId,
      tableNumber: table.tableNumber,
      qrUrl,
      message: 'QR generated. Print and place on table.',
    };
  }

  // POST /session/start — customer scans QR
async startSession(dto: StartSessionDto) {
  const table = await this.tableRepo.findOne({
    where: { id: dto.tableId, isActive: true },
  });

  if (!table) throw new NotFoundException('Table not found');

  const peopleJoining = dto.numberOfPeople ?? 1;

  // Check if table has enough space
  const remainingCapacity = table.capacity - table.currentOccupancy;
  if (remainingCapacity < 1) {
    throw new BadRequestException(
      `Table is full (${table.currentOccupancy}/${table.capacity})`,
    );
  }

  if (peopleJoining > remainingCapacity) {
    throw new BadRequestException(
      `Only ${remainingCapacity} seat(s) left at this table`,
    );
  }

  // Update occupancy
  table.currentOccupancy += peopleJoining;

  // Mark OCCUPIED only when full, otherwise PARTIALLY_OCCUPIED
  if (table.currentOccupancy >= table.capacity) {
    table.status = TableStatus.OCCUPIED;
  } else {
    table.status = TableStatus.PARTIALLY_OCCUPIED;
  }

  await this.tableRepo.save(table);

  const sessionToken = uuidv4();
  const session = this.sessionRepo.create({
    tableId: dto.tableId,
    sessionToken,
    numberOfPeople: peopleJoining,
    status: SessionStatus.PENDING,
  });

  const saved = await this.sessionRepo.save(session);

  return {
    sessionToken: saved.sessionToken,
    tableNumber: table.tableNumber,
    currentOccupancy: table.currentOccupancy,
    capacity: table.capacity,
    remainingSeats: table.capacity - table.currentOccupancy,
    message: `Seated ${peopleJoining} people. ${table.capacity - table.currentOccupancy} seats remaining.`,
  };
}

  // GET /session/:token
  async getSession(sessionToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { sessionToken },
      relations: ['table'],
    });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  // Activate session when first order is placed
  async activateSession(sessionToken: string) {
    const session = await this.sessionRepo.findOne({
      where: { sessionToken, status: SessionStatus.PENDING },
    });
    if (session) {
      session.status = SessionStatus.ACTIVE;
      await this.sessionRepo.save(session);
    }
  }

  // PATCH /session/end — bill paid
 async endSession(sessionToken: string) {
  const session = await this.sessionRepo.findOne({
    where: [
      { sessionToken, status: SessionStatus.ACTIVE },
      { sessionToken, status: SessionStatus.PENDING },
    ],
    relations: ['table'],
  });

  if (!session) throw new NotFoundException('Session not found');

  session.status = SessionStatus.CLOSED;
  session.endTime = new Date();
  await this.sessionRepo.save(session);

  const table = await this.tableRepo.findOne({
    where: { id: session.tableId },
  });

  if (table) {
    // Reduce occupancy by number of people in this session
    table.currentOccupancy = Math.max(
      0,
      table.currentOccupancy - (session.numberOfPeople ?? 1),
    );

    // Update status based on remaining occupancy
    if (table.currentOccupancy === 0) {
      table.status = TableStatus.AVAILABLE;
    } else {
      table.status = TableStatus.PARTIALLY_OCCUPIED;
    }

    await this.tableRepo.save(table);
  }

  return {
    message: 'Session closed.',
    tableNumber: table?.tableNumber,
    remainingOccupancy: table?.currentOccupancy,
    tableStatus: table?.status,
  };
}

  // GET /session — all active sessions (kitchen view)
  async getActiveSessions() {
    return this.sessionRepo.find({
      where: { status: SessionStatus.ACTIVE },
      relations: ['table'],
      order: { startTime: 'ASC' },
    });
  }
}