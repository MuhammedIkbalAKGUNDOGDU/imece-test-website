import axios from "axios";
import { API_BASE_URL, apiKey } from "../config";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "X-API-Key": apiKey,
    "Content-Type": "application/json",
  },
});

// Campaigns Service
export const campaignsService = {
  // Get all campaigns
  async getAllCampaigns() {
    try {
      const response = await api.get("/products/campaigns/");
      return response.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  },

  // Create new campaign
  async createCampaign(campaignData) {
    try {
      const config = {};
      if (campaignData instanceof FormData) {
        // Remove Content-Type header for FormData to let browser set it with boundary
        config.headers = {
          "X-API-Key": apiKey,
        };
      }
      const response = await api.post(
        "/products/campaigns/",
        campaignData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  },

  // Update campaign
  async updateCampaign(updateData) {
    try {
      const config = {};
      if (updateData instanceof FormData) {
        // Remove Content-Type header for FormData to let browser set it with boundary
        config.headers = {
          "X-API-Key": apiKey,
        };
      }
      const response = await api.put(
        "/products/campaigns/",
        updateData,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  },

  // Delete campaign
  async deleteCampaign(campaignId) {
    try {
      const response = await api.delete("/products/campaigns/", {
        data: { id: campaignId },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  },
};

// Stories Service
export const storiesService = {
  // Get all stories (type=story)
  async getStories() {
    try {
      const response = await api.get("/products/stories/?type=story");
      return response.data;
    } catch (error) {
      console.error("Error fetching stories:", error);
      throw error;
    }
  },

  // Get campaign stories (type=campaign)
  async getCampaignStories() {
    try {
      const response = await api.get("/products/stories/?type=campaign");
      return response.data;
    } catch (error) {
      console.error("Error fetching campaign stories:", error);
      throw error;
    }
  },

  // Create new story
  async createStory(storyData) {
    try {
      const config = {};
      if (storyData instanceof FormData) {
        // Remove Content-Type header for FormData to let browser set it with boundary
        config.headers = {
          "X-API-Key": apiKey,
        };
      }
      const response = await api.post("/products/stories/", storyData, config);
      return response.data;
    } catch (error) {
      console.error("Error creating story:", error);
      throw error;
    }
  },
};

// Default export for convenience
export default {
  campaignsService,
  storiesService,
};
