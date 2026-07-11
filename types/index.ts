import type { Course, Content, Enrollment, PaymentMethod } from "@prisma/client";

export type { Course, Content, Enrollment };

export interface EnrollFormData {
  courseId: string;
  studentName: string;
  whatsappNumber: string;
  email?: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}
