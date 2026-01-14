import { EntrepriseController } from './entrepriseController';
import { Entreprise } from '../../domain/entreprise';
import { Express, Request, Response } from 'express';

describe('EntrepriseController', () => {
  let mockService: {
    listEntreprises: jest.Mock<Promise<Entreprise[]>, []>;
    getEntreprise: jest.Mock<Promise<Entreprise | null>, [string]>;
    createEntreprise: jest.Mock<Promise<Entreprise>, [Omit<Entreprise, 'id'>]>;
    updateEntreprise: jest.Mock<
      Promise<Entreprise>,
      [string, Entreprise]
    >;
    deleteEntreprise: jest.Mock<Promise<void>, [string]>;
  };
  let controller: EntrepriseController;
  beforeEach(() => {
    mockService = {
      listEntreprises: jest.fn(),
      getEntreprise: jest.fn(),
      createEntreprise: jest.fn(),
      updateEntreprise: jest.fn(),
      deleteEntreprise: jest.fn(),
    };
    controller = new EntrepriseController(mockService as any);
  });

  it('listEntreprises retourne la liste fournie par le service', async () => {
    const sample: Entreprise[] = [
      new Entreprise('Entreprise A', '123456789', 'Address A'),
      new Entreprise('Entreprise B', '987654321', 'Address B'),
    ];
    (mockService.listEntreprises as jest.Mock).mockResolvedValue(sample);
    const req: any = {};
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controller.listEntreprises(req, res);

    expect(mockService.listEntreprises).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(sample);
  });

  it("getEntreprise retourne l'entreprise quand elle existe", async () => {
    const ent = new Entreprise('Entreprise A', '123456789', 'Address A', '1');
    (mockService.getEntreprise as jest.Mock).mockResolvedValue(ent);
    const req: any = { params: { id: '1' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getEntreprise(req, res);
    expect(mockService.getEntreprise).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(ent);
  });
  it("getEntreprise retourne 404 quand l'entreprise est introuvable", async () => {
    (mockService.getEntreprise as jest.Mock).mockResolvedValue(null);
    const req: any = { params: { id: 'missing' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getEntreprise(req, res);
    expect(mockService.getEntreprise).toHaveBeenCalledWith('missing');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Entreprise non trouvée');
  });
  it("createEntreprise appelle le service et retourne l'entreprise créée", async () => {
    const input = new Entreprise('Entreprise C', '112233445', 'Address C');
    const saved = new Entreprise('Entreprise C', '112233445', 'Address C', '2');
    (mockService.createEntreprise as jest.Mock).mockResolvedValue(saved);
    const req: any = { body: input };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controller.createEntreprise(req, res);
    expect(mockService.createEntreprise).toHaveBeenCalledWith(input);
    expect(res.json).toHaveBeenCalledWith(saved);
  });

  it('updateEntreprise met à jour une entreprise existante', async () => {
    const existing = new Entreprise(
      'Entreprise D',
      '556677889',
      'Address D',
      '3'
    );
    const updatedData: Partial<Omit<Entreprise, 'id'>> = {
      adresse: 'New Address D',
    };
    const updatedEntreprise = new Entreprise(
      existing.nom,
      existing.siret,
      updatedData.adresse!,
      existing.id
    );
    (mockService.updateEntreprise as jest.Mock).mockResolvedValue(
      updatedEntreprise
    );
    const req: any = { params: { id: '3' }, body: updatedData };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.updateEntreprise(req, res);
    expect(mockService.updateEntreprise).toHaveBeenCalledWith('3', updatedData);
    expect(res.json).toHaveBeenCalledWith(updatedEntreprise);
  });

  it('deleteEntreprise supprime une entreprise existante', async () => {
    const req: any = { params: { id: '4' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.deleteEntreprise(req, res);
    expect(mockService.deleteEntreprise).toHaveBeenCalledWith('4');
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
