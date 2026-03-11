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
  // No QR verification needed — security handled by session expiry
  const table = await this.tableRepo.findOne({
    where: { id: dto.tableId, isActive: true },
  });

  if (!table) throw new NotFoundException('Table not found');

  if (table.status === TableStatus.OCCUPIED) {
    throw new BadRequestException('Table is already occupied');
  }

  const sessionToken = uuidv4();
  table.status = TableStatus.OCCUPIED;
  await this.tableRepo.save(table);

  const session = this.sessionRepo.create({
    tableId: dto.tableId,
    sessionToken,
    status: SessionStatus.PENDING,
  });

  const saved = await this.sessionRepo.save(session);

  return {
    sessionToken: saved.sessionToken,
    tableNumber: table.tableNumber,
    message: 'Table reserved. Place your order within 15 minutes.',
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
      where:[
      { sessionToken, status: SessionStatus.ACTIVE },
      { sessionToken, status: SessionStatus.PENDING },
    ],
      
      relations: ['table'],
    });

    if (!session) throw new NotFoundException('Active session not found');

    session.status = SessionStatus.CLOSED;
    session.endTime = new Date();
    await this.sessionRepo.save(session);

    await this.tableRepo.update(session.tableId, {
      status: TableStatus.AVAILABLE,
    });

    return {
      message: 'Session closed. Thank you for dining with us!',
      tableNumber: session.table?.tableNumber,
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