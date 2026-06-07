export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  DISPATCHER: 'dispatcher',
  DRIVER: 'driver',
  ACCOUNTANT: 'accountant',
  VIEWER: 'viewer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const MODULE_ACCESS = {
  booking: { owner: 'full', admin: 'full', dispatcher: 'full', driver: 'own', accountant: 'none', viewer: 'read' },
  hr: { owner: 'full', admin: 'full', dispatcher: 'read', driver: 'own_profile', accountant: 'none', viewer: 'none' },
  fleet: { owner: 'full', admin: 'full', dispatcher: 'full', driver: 'read', accountant: 'none', viewer: 'none' },
  accounting: { owner: 'full', admin: 'none', dispatcher: 'none', driver: 'none', accountant: 'full', viewer: 'none' },
  crm: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
  legal: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
  vendor: { owner: 'full', admin: 'full', dispatcher: 'none', driver: 'none', accountant: 'none', viewer: 'none' },
  reports: { owner: 'full', admin: 'full', dispatcher: 'read', driver: 'none', accountant: 'full', viewer: 'read' },
} as const;
