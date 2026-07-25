export type PaymentMethod = "BKASH" | "NAGAD" | "ROCKET" | "WESTERN_UNION" | "BANK_TRANSFER";

export interface EnrollFormData {
  courseId: string;
  studentName: string;
  whatsappNumber: string;
  email?: string;
  contactNumber: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}
