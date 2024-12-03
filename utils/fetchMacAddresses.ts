export async function fetchMacAddresses(): Promise<string[]> {
  try {
    const response = await fetch('/api/getMac');
    if (!response.ok) {
      throw new Error(`Failed to fetch MAC addresses: ${response.statusText}`);
    }
    const data = await response.json();
    return data.macAddresses || [];
  } catch (error) {
    console.error('Error fetching MAC addresses:', error);
    return [];
  }
}
