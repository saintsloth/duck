// import express from 'express';
// import bodyParser from 'body-parser';
// import { useExpressServer } from 'routing-controllers';
// import { Express } from 'express-serve-static-core';
// import request from 'supertest';
// import { GlobalErrorHandler } from '../../src/middleware/global-error-handler';
// import { UserModel } from '../../src/model/user-model';
// import { UserController } from '../../src/controller/user-controller';
//
// describe('UserController', () => {
//   afterEach(() => {
//     jest.restoreAllMocks();
//   });
//
//   let server: Express;
//
//   beforeAll(async () => {
//     server = express();
//     server.use(bodyParser.json());
//     useExpressServer(server, {
//       controllers: [UserController], // we specify controllers we want to use
//       middlewares: [GlobalErrorHandler],
//       defaultErrorHandler: false,
//     });
//   });
//
//   it('postOne', () => {
//     const userController = new UserController();
//     const testBody = {
//       city: 'SPb',
//     };
//     const res = userController.postOne(1, testBody as UserModel);
//     expect(res).toEqual(testBody);
//   });
//
//   it('postOne with validations', (done) => {
//     request(server)
//       .post('/users/1')
//       .send({
//         city: 'SPb',
//       } as UserModel)
//       .expect(400)
//       .end((err, res) => {
//         if (err) throw new Error(JSON.stringify(res.body));
//         done();
//       });
//   });
// });
