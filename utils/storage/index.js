import createStorage from './stroage';

export const ulocalStorage = createStorage({
	type: 'local',
  });
export const usessionStorage = createStorage({
type: 'session',
});