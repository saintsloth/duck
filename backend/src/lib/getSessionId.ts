import { has, get } from 'lodash';

export const getSessionId = (request: Request) => {
  if (has(request, 'sessionID')) {
    return get(request, 'sessionID');
  }
  return 'no-session-id';
};
// TODO delete this
// export const getSessionIdString = (request: Request) => {
//   if (has(request, 'sessionId')) {
//     return `sessionID: ${get(request, 'sessionId')}`;
//   }
//   return 'sessionID: no-session-id';
// };
