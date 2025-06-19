import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * @class GstClientService
 * @description Service for interacting with an external GST portal to fetch taxpayer information.
 */
export class GstClientService {
  private gstPortalBaseUrl = 'https://services.gst.gov.in/services/searchtp'; // Placeholder URL

  /**
   * Fetches the taxpayer's legal name from the GST portal using their GSTIN.
   * @param {string} gstin - The GST Identification Number of the taxpayer.
   * @returns {Promise<string | null>} The legal name of the taxpayer if found, otherwise null.
   */
  public async getTaxpayerNameByGstin(gstin: string): Promise<string | null> {
    if (!gstin || typeof gstin !== 'string' || gstin.length !== 15) {
      console.error('[GstClientService] Invalid GSTIN format provided.');
      return null;
    }

    const targetUrl = `${this.gstPortalBaseUrl}?searchval=${gstin}`;
    console.log(`[GstClientService] Fetching GST details from URL: ${targetUrl}`);

    try {
      const response = await axios.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (response.status !== 200) {
        console.error(`[GstClientService] GST portal request failed with status: ${response.status}`);
        return null;
      }

      const html = response.data as string;
      const $ = cheerio.load(html);

      let taxpayerName: string | null = null;

      // Try 1: by ID
      const nameById = $('#lblEntlglTradNm');
      if (nameById.length > 0) {
        taxpayerName = nameById.text().trim();
      }

      // Try 2: by class
      if (!taxpayerName) {
        const nameByClass = $('.taxpayer-legal-name');
        if (nameByClass.length > 0) {
          taxpayerName = nameByClass.first().text().trim();
        }
      }

      if (taxpayerName) {
        console.log(`[GstClientService] Found taxpayer name: "${taxpayerName}" for GSTIN: ${gstin}`);
        return taxpayerName;
      }

      console.warn(`[GstClientService] Taxpayer name not found in HTML for GSTIN: ${gstin}`);
      return null;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(`[GstClientService] Axios error fetching GST details: ${error.message}`);
        if (error.response) {
          console.error(`[GstClientService] Status: ${error.response.status}`);
        }
      } else {
        console.error(`[GstClientService] Unexpected error:`, error);
      }
      return null;
    }
  }
}
