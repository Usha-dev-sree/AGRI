import AuditLog from '../models/AuditLog.js';
import { inMemoryDB } from '../config/db.js';

export const logAudit = async (req, action, entity, entityId, details = {}) => {
  try {
    const logData = {
      userId: req?.user?._id || null,
      userRole: req?.user?.role || 'system',
      userName: req?.user?.name || 'System Auto-Agent',
      action,
      entity,
      entityId: entityId?.toString() || '',
      details,
      ipAddress: req?.ip || req?.connection?.remoteAddress || '127.0.0.1',
      createdAt: new Date()
    };

    try {
      await AuditLog.create(logData);
    } catch (err) {
      logData._id = 'audit_' + Date.now() + Math.random().toString(36).substr(2, 5);
      inMemoryDB.auditLogs.unshift(logData);
    }
  } catch (err) {
    console.error('Audit Logging non-fatal error:', err.message);
  }
};
