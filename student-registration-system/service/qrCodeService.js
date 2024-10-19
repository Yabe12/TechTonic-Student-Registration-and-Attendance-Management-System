/**
 * Function to verify if the QR code data matches the student's ID.
 * @param {string} qrCodeData - The data contained in the scanned QR code.
 * @param {string} studentId - The student's ID to validate against.
 * @returns {boolean} - Returns true if the QR code data matches the student ID, false otherwise.
 */
exports.verifyQRCode = async (qrCodeData, studentId) => {
  try {
      // Simple validation logic: Check if QR code data matches the student's ID
      return qrCodeData === studentId;
  } catch (error) {
      console.error('Error verifying QR code', error);
      return false;
  }
};
