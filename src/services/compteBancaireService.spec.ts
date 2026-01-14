import { CompteBancaireService } from './compteBancaire.service';
import { CompteBancaire } from '../domain/compteBancaire';
import { Entreprise } from '../domain/entreprise';

describe('CompteBancaireService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<CompteBancaire[]>, []>;
    findById: jest.Mock<Promise<CompteBancaire | null>, [string]>;
    save: jest.Mock<Promise<CompteBancaire>, [Omit<CompteBancaire, 'id'>]>;
    update: jest.Mock<Promise<CompteBancaire>, [string, CompteBancaire]>;
    delete: jest.Mock<Promise<void>, [string]>;
    findByEntrepriseId: jest.Mock<Promise<CompteBancaire[]>, [string]>;
  };
  let service: CompteBancaireService;
  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByEntrepriseId: jest.fn(),
    };
    service = new CompteBancaireService(mockRepo);
    const entreprise = new Entreprise(
      'Entreprise A',
      '123456789',
      'Address A',
      '1'
    );
  });

  it('listComptesBancaires retourne la liste fournie par le repo', async () => {
    const sample: CompteBancaire[] = [
      new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1'),
      new CompteBancaire('654321', 'IBAN456', 'BIC456', '2', '1'),
    ];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listComptesBancaires()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it('getCompteBancaire retourne le compte quand il existe', async () => {
    const compte = new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1');
    mockRepo.findById.mockResolvedValue(compte);
    await expect(service.getCompteBancaire('1')).resolves.toEqual(compte);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });
  it('getCompteBancaire retourne null quand le compte est introuvable', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getCompteBancaire('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
  it('createCompteBancaire appelle save et retourne le compte créé', async () => {
    const input = new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', '1');
    const { solde, numeroCompte, devise, type, entrepriseId } = input;
    const saved = new CompteBancaire(
      solde,
      numeroCompte,
      devise,
      type,
      entrepriseId,
      '2'
    );
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createCompteBancaire(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
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
    const updatedData = new CompteBancaire(
      '654321',
      'IBAN456',
      'BIC456',
      '2',
      '1',
      '3'
    );
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updatedData);
    await expect(
      service.updateCompteBancaire('3', updatedData)
    ).resolves.toEqual(updatedData);
    expect(mockRepo.findById).toHaveBeenCalledWith('3');
    expect(mockRepo.update).toHaveBeenCalledWith('3', updatedData);
  });
  it("updateCompteBancaire lance une erreur si le compte n'existe pas", async () => {
    mockRepo.findById.mockResolvedValue(null);
    const updatedData = new CompteBancaire(
      '654321',
      'IBAN456',
      'BIC456',
      '2',
      '1',
      'missing'
    );
    await expect(
      service.updateCompteBancaire('missing', updatedData)
    ).rejects.toThrow('Compte bancaire introuvable');
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
  it('deleteCompteBancaire supprime un compte bancaire existant', async () => {
    const existing = new CompteBancaire(
      '123456',
      'IBAN123',
      'BIC123',
      '1',
      '1',
      '4'
    );
    mockRepo.findById.mockResolvedValue(existing);
    await expect(service.deleteCompteBancaire('4')).resolves.toBeUndefined();
    expect(mockRepo.findById).toHaveBeenCalledWith('4');
    expect(mockRepo.delete).toHaveBeenCalledWith('4');
  });
  it("deleteCompteBancaire lance une erreur si le compte n'existe pas", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.deleteCompteBancaire('missing')).rejects.toThrow(
      'Compte bancaire introuvable'
    );
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
  it('getCompteBancaireByEntrepriseId retourne les comptes pour une entreprise donnée', async () => {
    const entrepriseId = '1';
    const comptes: CompteBancaire[] = [
      new CompteBancaire('123456', 'IBAN123', 'BIC123', '1', entrepriseId, '1'),
      new CompteBancaire('654321', 'IBAN456', 'BIC456', '2', entrepriseId, '2'),
    ];
    mockRepo.findByEntrepriseId.mockResolvedValue(comptes);
    await expect(
      service.getCompteBancaireByEntrepriseId(entrepriseId)
    ).resolves.toEqual(comptes);
    expect(mockRepo.findByEntrepriseId).toHaveBeenCalledWith(entrepriseId);
  });
});
