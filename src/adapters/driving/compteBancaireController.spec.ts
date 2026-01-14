import { CompteBancaireController } from './compteBancaireController';
import { CompteBancaire } from '../../domain/compteBancaire';
import { any } from 'zod';

describe('CompteBancaireController', () => {
  let mockService: {
    listComptesBancaires: jest.Mock<Promise<CompteBancaire[]>, []>;
    getCompteBancaire: jest.Mock<Promise<CompteBancaire | null>, [string]>;
    createCompteBancaire: jest.Mock<Promise<CompteBancaire>, [Omit<CompteBancaire, 'id'>]>;
    updateCompteBancaire: jest.Mock<Promise<CompteBancaire>, [string, Partial<Omit<CompteBancaire, 'id'>>]>;
    deleteCompteBancaire: jest.Mock<Promise<void>, [string]>;
  };
  let controller: CompteBancaireController;
  beforeEach(() => {
    mockService = {
      listComptesBancaires: jest.fn(),
      getCompteBancaire: jest.fn(),
      createCompteBancaire: jest.fn(),
      updateCompteBancaire: jest.fn(),
      deleteCompteBancaire: jest.fn(),
    };
    controller = new CompteBancaireController(mockService as any);
  });

  it('listComptesBancaires retourne la liste fournie par le repo', async () => {
    const sample: CompteBancaire[] = [
      new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1'),
      new CompteBancaire('654321', 'IBAN456', 'BIC456', '2', '1'),
    ];
    // prepare mocks
    (mockService.listComptesBancaires as jest.Mock).mockResolvedValue(sample);
    const req: any = {};
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await controller.listComptes(req, res);

    expect(mockService.listComptesBancaires).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(sample);
  });
  it('getCompteBancaire retourne le compte quand il existe', async () => {
    const compte = new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1');
    (mockService.getCompteBancaire as jest.Mock).mockResolvedValue(compte);
    const req: any = { params: { id: '1' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getCompte(req, res);

    expect(mockService.getCompteBancaire).toHaveBeenCalledWith('1');
    expect(res.json).toHaveBeenCalledWith(compte);
  });
  it('getCompteBancaire retourne 404 quand le compte est introuvable', async () => {
    (mockService.getCompteBancaire as jest.Mock).mockResolvedValue(null);
    const req: any = { params: { id: 'missing' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.getCompte(req, res);
    expect(mockService.getCompteBancaire).toHaveBeenCalledWith('missing');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Compte bancaire non trouvé');
  });
  it('createCompteBancaire appelle le service et retourne le compte créé', async () => {
    const input = new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1');
    const saved = new CompteBancaire(
      '123456',
      'IBAN123',
      'BIC123',
      '1',  
      '1',
      '2'
    );
    (mockService.createCompteBancaire as jest.Mock).mockResolvedValue(saved);
    const req: any = { body: input };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.createCompte(req, res);
    expect(mockService.createCompteBancaire).toHaveBeenCalledWith(input);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(saved); 
  });
  it('updateCompteBancaire met à jour un compte existant', async () => {
    const existing = new CompteBancaire(
      '123456',
      'IBAN123',
      'BIC123',
      '1',
      '1',
      '3'
    );
    const updatedData: Partial<Omit<CompteBancaire, 'id'>> = {
      solde: '654321',
    };
    const updatedCompte = new CompteBancaire( 
      updatedData.solde!,
      existing.numeroCompte,
      existing.devise,
      existing.type,
      existing.entrepriseId,
      existing.id
    );
    (mockService.updateCompteBancaire as jest.Mock).mockResolvedValue(updatedCompte); 
    const req: any = { params: { id: '3' }, body: updatedData };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.updateCompte(req, res);
    expect(mockService.updateCompteBancaire).toHaveBeenCalledWith('3', updatedData);
    expect(res.json).toHaveBeenCalledWith(updatedCompte);
  });
  it('deleteCompteBancaire supprime un compte existant', async () => {
    (mockService.deleteCompteBancaire as jest.Mock).mockResolvedValue(any);
    const req: any = { params: { id: '3' } };
    const res: any = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    await controller.deleteCompte(req, res);
    expect(mockService.deleteCompteBancaire).toHaveBeenCalledWith('3');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
