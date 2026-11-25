import { db } from '../../db/schema';

export const countCards = () => db.cards.count();
export const countDue = () => db.cards.where('due').belowOrEqual(new Date().toISOString()).count();
