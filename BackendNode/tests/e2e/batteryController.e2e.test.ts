import request from 'supertest';
import express from 'express';

import IBatteryDTO from '../../src/dto/IBatteryDTO';
import BatteryController from '../../src/controllers/batteryController';
import BatteryService from '../../src/services/batteryService';
import { describe, beforeEach, it, afterEach } from "mocha";


const app = express();
app.use(express.json());

const mockBatteryService: Partial<BatteryService> = {
  createBattery: jest.fn(),
  getBattery: jest.fn(),
  updateBattery: jest.fn(),
  deleteBattery: jest.fn(),
  findAll: jest.fn(),
};

const controller = new BatteryController();
app.post('/api/battery', controller.createBattery.bind(controller));
app.get('/api/battery/:id', controller.getBattery.bind(controller));
app.put('/api/battery', controller.updateBattery.bind(controller));
app.delete('/api/battery/:id', controller.deleteBattery.bind(controller));
app.get('/api/battery', controller.findAll.bind(controller));

const validBatteryDTO: IBatteryDTO = {
  id: 'batt-001',
  name: 'Battery A',
  description: 'Solar battery',
  efficiency: '85',
  maxCapacity: '1000',
  initialCapacity: '500',
  maxChargeDischarge: '100',
};

describe('BatteryController e2e', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/battery → should create battery', async () => {
    (mockBatteryService.createBattery as jest.Mock).mockResolvedValueOnce({
      isSuccess: true,
      getValue: () => validBatteryDTO,
    });

    const response = await request(app).post('/api/battery').send(validBatteryDTO);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Battery A');
  });

  it('GET /api/battery/:id → should return battery if found', async () => {
    (mockBatteryService.getBattery as jest.Mock).mockResolvedValueOnce({
      isSuccess: true,
      getValue: () => validBatteryDTO,
    });

    const response = await request(app).get('/api/battery/batt-001');
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('batt-001');
  });

  it('GET /api/battery/:id → should return 404 if not found', async () => {
    (mockBatteryService.getBattery as jest.Mock).mockResolvedValueOnce({
      isSuccess: false,
      error: 'Prosumer battery not found',
    });

    const response = await request(app).get('/api/battery/batt-404');
    expect(response.status).toBe(404);
  });

  it('PUT /api/battery → should update battery', async () => {
    (mockBatteryService.updateBattery as jest.Mock).mockResolvedValueOnce({
      isSuccess: true,
      getValue: () => validBatteryDTO,
    });

    const response = await request(app).put('/api/battery').send(validBatteryDTO);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('batt-001');
  });

  it('DELETE /api/battery/:id → should delete battery', async () => {
    (mockBatteryService.deleteBattery as jest.Mock).mockResolvedValueOnce({
      isSuccess: true,
    });

    const response = await request(app).delete('/api/battery/batt-001');
    expect(response.status).toBe(200);
  });

  it('GET /api/battery → should return all batteries', async () => {
    (mockBatteryService.findAll as jest.Mock).mockResolvedValueOnce({
      isSuccess: true,
      getValue: () => [validBatteryDTO],
    });

    const response = await request(app).get('/api/battery');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
