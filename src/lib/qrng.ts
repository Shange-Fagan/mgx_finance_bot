import axios from 'axios';

// Interface for QRNG API response
interface QRNGResponse {
  type: string;
  length: number;
  data: number[];
  success: boolean;
}

// Generate random number using the ANU Quantum Random Number Generator API
export const generateQuantumRandom = async (): Promise<number> => {
  try {
    const response = await axios.get<QRNGResponse>(
      'https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8'
    );
    
    if (!response.data.success) {
      throw new Error('QRNG API request failed');
    }
    
    return response.data.data[0];
  } catch (error) {
    console.error('Error generating quantum random number:', error);
    // Fallback to pseudo-random if quantum API fails
    return Math.floor(Math.random() * 256);
  }
};

// Generate credits based on quantum randomness
export const generateCredits = async (): Promise<number> => {
  try {
    const quantumValue = await generateQuantumRandom();
    
    // Using the provided logic: award 7 credits if value > 70
    if (quantumValue > 70) {
      return 7;
    }
    
    return 0;
  } catch (error) {
    console.error('Error generating credits:', error);
    return 0;
  }
};

// Convert credits to dollar value (100 credits = $1)
export const convertCreditsToDollars = (credits: number): number => {
  // Using the provided conversion rate: balance * 1000 / 100000
  return (credits * 1000) / 100000;
};