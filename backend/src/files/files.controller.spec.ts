import { Test, TestingModule } from '@nestjs/testing';
import { Readable } from 'stream';
import { FilesController } from './files.controller';
//TODO: Должен ли быть FileService в проекте?
//import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        //FilesService
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should return url with uploaded file path', () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-image.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: './public/uploads',
        filename: 'abc123-uuid.png',
        path: './public/uploads/abc123-uuid.png',
        size: 1024,
        stream: {} as Readable,
        buffer: Buffer.from([]),
      };

      const result = controller.uploadFile(mockFile);

      expect(result).toEqual({
        url: '/uploads/abc123-uuid.png',
      });
    });
  });
});
