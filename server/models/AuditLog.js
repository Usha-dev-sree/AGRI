import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    userRole: {
      type: String,
      default: 'system'
    },
    userName: {
      type: String,
      default: 'System Agent'
    },
    action: {
      type: String,
      required: true
    },
    entity: {
      type: String,
      required: true
    },
    entityId: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    }
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
