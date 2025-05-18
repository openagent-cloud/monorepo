import { AdapterType } from "@prisma/client";

/**
 * Converts our AdapterType enum to a Prisma-compatible type for database operations
 * This helps bridge the gap between our application's enum and Prisma's generated enum
 */
export function toPrismaAdapterType(adapterType: AdapterType): AdapterType {
  // Check if adapterType is defined before calling toString()
  if (!adapterType) {
    throw new Error('AdapterType is required');
  }
  // Simply return the adapter type as is, since Prisma expects the enum value
  return adapterType;
}

/**
 * Converts a string adapter name to our AdapterType enum
 * Useful when receiving adapter names from external sources like API requests
 */
export function toAdapterType(adapterName: string): AdapterType {
  // Check if adapterName is defined and not empty
  if (!adapterName) {
    throw new Error('Adapter name is required');
  }
  
  // Convert to lowercase and try to match with our enum values
  const normalizedName = adapterName.toLowerCase();
  switch (normalizedName) {
    case 'openai':
      return AdapterType.openai;
    case 'anthropic':
      return AdapterType.anthropic;
    case 'cohere':
      return AdapterType.cohere;
    default:
      throw new Error(`Unsupported adapter: ${adapterName}`);
  }
}
