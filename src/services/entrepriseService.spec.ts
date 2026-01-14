import { EntrepriseService } from './entreprise.service';
import { Entreprise } from '../domain/entreprise';

describe('EntrepriseService', () => {
  let mockRepo: {
    findAll: jest.Mock<Promise<Entreprise[]>, []>;
    findById: jest.Mock<Promise<Entreprise | null>, [string]>;
    save: jest.Mock<Promise<Entreprise>, [Omit<Entreprise, 'id'>]>;
    update: jest.Mock<Promise<Entreprise>, [string, Entreprise]>;
    delete: jest.Mock<Promise<void>, [string]>;
  };
  let service: EntrepriseService;
  beforeEach(() => {
    mockRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new EntrepriseService(mockRepo);
  });

  it('listEntreprises retourne la liste fournie par le repo', async () => {
    const sample: Entreprise[] = [
      new Entreprise('Entreprise A', '123456789', 'Address A'),
      new Entreprise('Entreprise B', '987654321', 'Address B'),
    ];
    mockRepo.findAll.mockResolvedValue(sample);
    await expect(service.listEntreprises()).resolves.toEqual(sample);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
  });
  it("getEntreprise retourne l'entreprise quand elle existe", async () => {
    const ent = new Entreprise('Entreprise A', '123456789', 'Address A', '1');
    mockRepo.findById.mockResolvedValue(ent);
    await expect(service.getEntreprise('1')).resolves.toEqual(ent);
    expect(mockRepo.findById).toHaveBeenCalledWith('1');
  });
  it("getEntreprise retourne null quand l'entreprise est introuvable", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getEntreprise('missing')).resolves.toBeNull();
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
  it("createEntreprise appelle save et retourne l'entreprise créée", async () => {
    const input = new Entreprise('Entreprise C', '112233445', 'Address C');
    const { nom, siret, adresse } = input;
    const saved = new Entreprise(nom, siret, adresse, '2');
    mockRepo.save.mockResolvedValue(saved);
    await expect(service.createEntreprise(input)).resolves.toEqual(saved);
    expect(mockRepo.save).toHaveBeenCalledWith(input);
  });
  it('updateEntreprise met à jour une entreprise existante', async () => {
    const existing = new Entreprise(
      'Entreprise D',
      '556677889',
      'Address D',
      '3'
    );
    const updatedData = new Entreprise(
      'Entreprise D',
      '556677889',
      'New Address D',
      '3'
    );
    mockRepo.findById.mockResolvedValue(existing);
    mockRepo.update.mockResolvedValue(updatedData);
    await expect(service.updateEntreprise('3', updatedData)).resolves.toEqual(
      updatedData
    );
    expect(mockRepo.findById).toHaveBeenCalledWith('3');
    expect(mockRepo.update).toHaveBeenCalledWith('3', updatedData);
  });
  it("updateEntreprise lance une erreur si l'entreprise n'existe pas", async () => {
    mockRepo.findById.mockResolvedValue(null);
    const updatedData = new Entreprise(
      'Entreprise X',
      '000000000',
      'Address X',
      'missing'
    );
    await expect(
      service.updateEntreprise('missing', updatedData)
    ).rejects.toThrow('Entreprise introuvable');
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
  it('deleteEntreprise supprime une entreprise existante', async () => {
    const existing = new Entreprise(
      'Entreprise E',
      '998877665',
      'Address E',
      '4'
    );
    mockRepo.findById.mockResolvedValue(existing);
    await expect(service.deleteEntreprise('4')).resolves.toBeUndefined();
    expect(mockRepo.findById).toHaveBeenCalledWith('4');
    expect(mockRepo.delete).toHaveBeenCalledWith('4');
  });
  it("deleteEntreprise lance une erreur si l'entreprise n'existe pas", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.deleteEntreprise('missing')).rejects.toThrow(
      'Entreprise introuvable'
    );
    expect(mockRepo.findById).toHaveBeenCalledWith('missing');
  });
});
